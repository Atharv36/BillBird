package com.app.invoiceapp.InvoiceApp.service;

import com.app.invoiceapp.InvoiceApp.dto.InvoiceRequestDTO;
import com.app.invoiceapp.InvoiceApp.entity.Invoice;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface InvoiceService {

    Invoice createInvoice(InvoiceRequestDTO req, Long userId);

    Optional<Invoice> getInvoiceById(Long id, Long userId);

    List<Invoice> getInvoiceByUser(Long userId);

    Page<Invoice> getInvoicesPaginated(Long userId, int page, int size);

    Invoice updateInvoice(Long id, InvoiceRequestDTO req, Long userId);

    void deleteInvoice(Long id, Long userId);

}
