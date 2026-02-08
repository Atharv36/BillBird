package com.app.invoiceapp.InvoiceApp.security.response;

public class LoginResponse {
    private Long id;
    private String  jwtToken;
    private String username;
    private String email;

    public LoginResponse(Long id, String username, String email, String jwtToken) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.jwtToken = jwtToken;
    }

    public LoginResponse(Long id, String username,String email) {
        this.id = id;
        this.username = username;
        this.email = email;

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


