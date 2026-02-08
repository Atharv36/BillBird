package com.app.invoiceapp.InvoiceApp.controller;

import com.app.invoiceapp.InvoiceApp.ratelimit.RateLimit;
import com.app.invoiceapp.InvoiceApp.security.request.LoginRequest;
import com.app.invoiceapp.InvoiceApp.security.request.RegisterRequest;
import com.app.invoiceapp.InvoiceApp.security.request.UpdateUserRequest;
import com.app.invoiceapp.InvoiceApp.security.response.LoginResponse;
import com.app.invoiceapp.InvoiceApp.security.services.UserDetailsImpl;
import com.app.invoiceapp.InvoiceApp.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.app.invoiceapp.InvoiceApp.security.jwt.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    // ===================== SIGN IN =====================
    @PostMapping("/signin")
    @RateLimit(requests = 7, timeWindow = 180) // 7 requests per 3 minutes
    public ResponseEntity<?> authenticateUser(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        // Let Spring Security / GlobalExceptionHandler handle authentication errors
        LoginResponse loginResponse =
                authService.authenticate(loginRequest, response);

        return ResponseEntity.ok(loginResponse);
    }

    // ===================== REGISTER =====================
    @PostMapping("/register")
    @RateLimit(requests = 7, timeWindow = 180) // 7 requests per 3 minutes
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterRequest registerRequest
    ) {
        authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("User Registered Successfully");
    }

    // ===================== CURRENT USERNAME =====================
    @GetMapping("/username")
    public ResponseEntity<?> currentUsername(Authentication authentication) {
        if (authentication != null) {
            return ResponseEntity.ok(authentication.getName());
        }
        return ResponseEntity.ok("NULL");
    }

    // ===================== CURRENT EMAIL =====================
    @GetMapping("/email")
    public ResponseEntity<?> currentEmail(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            return ResponseEntity.ok(userDetails.getEmail());
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected authentication type");
    }

    // ===================== CURRENT USER =====================
    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        LoginResponse response = new LoginResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    // ===================== SIGN OUT =====================
    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("You Have Been signed out !!!");
    }

    // ===================== UPDATE USER =====================
    @PutMapping("/user")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UpdateUserRequest updateRequest,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        try {
            authService.updateUser(userDetails.getId(), updateRequest);
            
            // Remove the auth-token cookie when user edits profile
            // This forces the user to log in again with updated credentials
            ResponseCookie clearCookie = jwtUtils.getCleanJwtCookie();
            
            // Return response with cleared cookie
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .body("User updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
