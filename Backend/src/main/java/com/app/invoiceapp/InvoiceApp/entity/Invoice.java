package com.app.invoiceapp.InvoiceApp.entity;

import com.app.invoiceapp.InvoiceApp.utils.JsonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices"
,uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "invoice_number"})
}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String invoiceNumber;

    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private Object invoiceJson;


    @CreationTimestamp
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

}
