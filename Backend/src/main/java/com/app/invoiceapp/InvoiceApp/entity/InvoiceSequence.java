package com.app.invoiceapp.InvoiceApp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice_sequence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int year;

    private int lastNumber;



}



