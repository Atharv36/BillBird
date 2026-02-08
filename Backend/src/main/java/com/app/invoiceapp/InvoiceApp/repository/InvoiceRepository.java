package com.app.invoiceapp.InvoiceApp.repository;

import com.app.invoiceapp.InvoiceApp.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    List<Invoice> findByUserId(Long userId);

    Optional<Invoice> findByIdAndUserId(Long id, Long userId);

    List<Invoice> findByUserIdOrderByCreatedAtDesc(Long userId);


    Page<Invoice> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

}
