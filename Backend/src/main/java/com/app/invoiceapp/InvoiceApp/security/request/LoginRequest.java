package com.app.invoiceapp.InvoiceApp.security.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;
    private String password;


}
