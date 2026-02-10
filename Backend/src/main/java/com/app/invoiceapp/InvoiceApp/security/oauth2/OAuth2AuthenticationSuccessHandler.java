package com.app.invoiceapp.InvoiceApp.security.oauth2;

import com.app.invoiceapp.InvoiceApp.entity.User;
import com.app.invoiceapp.InvoiceApp.repository.UserRepository;
import com.app.invoiceapp.InvoiceApp.security.jwt.JwtUtils;
import com.app.invoiceapp.InvoiceApp.security.services.UserDetailsImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.app.frontendurl}")
    private String frontendUrl;

    @Value("${spring.app.oauth2RedirectPath:/oauth2/redirect}")
    private String oauth2RedirectPath;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            log.info("OAuth2 user attributes: {}", oauth2User.getAttributes());
            String email = oauth2User.getAttribute("email");

            if (email == null || email.isBlank()) {
                log.warn("OAuth2 login missing email. Attributes: {}", oauth2User.getAttributes());
                String targetUrl = buildRedirectUrl("missing_email", null);
                response.sendRedirect(targetUrl);
                return;
            }

            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            User user = existingUserOpt.orElseGet(() -> {
                String username = generateUniqueUsername(email);
                String randomPassword = UUID.randomUUID().toString();
                return userRepository.save(User.builder()
                        .email(email)
                        .username(username)
                        .password(passwordEncoder.encode(randomPassword))
                        .build());
            });

            if (user.getUsername() == null || user.getUsername().isBlank()) {
                String username = generateUniqueUsername(email);
                user.setUsername(username);
                user = userRepository.save(user);
            }

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

            String token = jwtUtils.generateTokenFromUsername(userDetails.getUsername());
            String targetUrl = buildRedirectUrl("success", token);
            response.sendRedirect(targetUrl);
        } catch (Exception e) {
            log.error("OAuth2 success handler failed", e);
            String targetUrl = buildRedirectUrl("error", null);
            response.sendRedirect(targetUrl);
        }
    }

    private String buildRedirectUrl(String status, String token) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path(oauth2RedirectPath)
                .queryParam("status", status);

        if (token != null && !token.isBlank()) {
            builder.queryParam("token", token);
        }

        return builder.build().toUriString();
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0].toLowerCase(Locale.ROOT);
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }
}
