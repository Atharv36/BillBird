package com.app.invoiceapp.InvoiceApp.exception;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public class ApiError {

    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ApiError(HttpStatus status, String message, String path) {
        this.timestamp = Instant.now();
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.message = message;
        this.path = path;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }
}

