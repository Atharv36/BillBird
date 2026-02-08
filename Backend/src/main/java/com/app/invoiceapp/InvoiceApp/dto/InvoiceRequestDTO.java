package com.app.invoiceapp.InvoiceApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class InvoiceRequestDTO {

    @NotBlank
    private String invoiceNumber;

    @NotNull
    private Map<String, Object> invoiceJson;
}
