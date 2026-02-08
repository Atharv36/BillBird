package com.app.invoiceapp.InvoiceApp.repository;

import com.app.invoiceapp.InvoiceApp.entity.InvoiceSequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceSequenceRepository
        extends JpaRepository<InvoiceSequence, Long> {

    Optional<InvoiceSequence> findByUserIdAndYear(Long userId, int year);
}
