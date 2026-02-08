package com.app.invoiceapp.InvoiceApp.service;

import com.app.invoiceapp.InvoiceApp.security.request.LoginRequest;
import com.app.invoiceapp.InvoiceApp.security.request.RegisterRequest;
import com.app.invoiceapp.InvoiceApp.security.request.UpdateUserRequest;
import com.app.invoiceapp.InvoiceApp.security.response.LoginResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponse authenticate(LoginRequest loginRequest, HttpServletResponse response);

    void register(RegisterRequest registerRequest);

    void updateUser(Long userId, UpdateUserRequest updateRequest);
}
