package com.app.invoiceapp.InvoiceApp.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponseDTO {
    private Long id;
    private String invoiceNumber;
    private Object invoiceJson;
    private LocalDate createdAt;
}
