package com.app.invoiceapp.InvoiceApp.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Value("${spring.app.frontendurl}")
    private String frontendUrl;

    @Value("${spring.app.oauth2RedirectPath:/oauth2/redirect}")
    private String oauth2RedirectPath;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException, ServletException {
        String targetUrl = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path(oauth2RedirectPath)
                .queryParam("status", "error")
                .queryParam("message", "oauth2_failed")
                .build()
                .toUriString();

        response.sendRedirect(targetUrl);
    }
}
