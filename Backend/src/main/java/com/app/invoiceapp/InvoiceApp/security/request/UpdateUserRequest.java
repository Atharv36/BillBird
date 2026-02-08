package com.app.invoiceapp.InvoiceApp.security.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String username;

    @Email(message = "Enter a valid email")
    private String email;

    private String password;

}


