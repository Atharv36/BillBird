package com.app.invoiceapp.InvoiceApp.service;

import com.app.invoiceapp.InvoiceApp.entity.User;
import com.app.invoiceapp.InvoiceApp.exception.BadRequestException;
import com.app.invoiceapp.InvoiceApp.repository.UserRepository;
import com.app.invoiceapp.InvoiceApp.security.jwt.JwtUtils;
import com.app.invoiceapp.InvoiceApp.security.request.LoginRequest;
import com.app.invoiceapp.InvoiceApp.security.request.RegisterRequest;
import com.app.invoiceapp.InvoiceApp.security.request.UpdateUserRequest;
import com.app.invoiceapp.InvoiceApp.security.response.LoginResponse;
import com.app.invoiceapp.InvoiceApp.security.services.UserDetailsImpl;
import com.app.invoiceapp.InvoiceApp.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse authenticate(
            LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getIdentifier(),
                                loginRequest.getPassword()
                        )
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie =
                jwtUtils.generateJwtCookie(userDetails);

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return new LoginResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                jwtCookie.toString()
        );
    }

    @Override
    public void register(RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username already registered");
        }

        User user = new User(
                registerRequest.getEmail(),
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword())
        );

        userRepository.save(user);
    }

    @Override
    public void updateUser(Long userId, UpdateUserRequest updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (StringUtils.hasText(updateRequest.getUsername())) {
            if (userRepository.existsByUsername(updateRequest.getUsername()) &&
                    !user.getUsername().equals(updateRequest.getUsername())) {
                throw new BadRequestException("Username already taken");
            }
            user.setUsername(updateRequest.getUsername());
        }

        if (StringUtils.hasText(updateRequest.getEmail())) {
            if (userRepository.existsByEmail(updateRequest.getEmail()) &&
                    !user.getEmail().equals(updateRequest.getEmail())) {
                throw new BadRequestException("Email already registered");
            }
            user.setEmail(updateRequest.getEmail());
        }

        if (StringUtils.hasText(updateRequest.getPassword())) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        userRepository.save(user);
    }
}
