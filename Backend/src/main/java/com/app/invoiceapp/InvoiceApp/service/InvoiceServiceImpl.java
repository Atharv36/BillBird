package com.app.invoiceapp.InvoiceApp.service;

import com.app.invoiceapp.InvoiceApp.dto.InvoiceRequestDTO;
import com.app.invoiceapp.InvoiceApp.entity.Invoice;
import com.app.invoiceapp.InvoiceApp.entity.InvoiceSequence;
import com.app.invoiceapp.InvoiceApp.exception.NotFoundException;
import com.app.invoiceapp.InvoiceApp.repository.InvoiceRepository;
import com.app.invoiceapp.InvoiceApp.repository.InvoiceSequenceRepository;
import com.app.invoiceapp.InvoiceApp.repository.UserRepository;
import com.app.invoiceapp.InvoiceApp.service.InvoiceService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceSequenceRepository sequenceRepository;

    @Autowired
    private UserRepository userRepository;

    // ===================== CREATE INVOICE =====================
    @Override
    @Transactional
    public Invoice createInvoice(InvoiceRequestDTO req, Long userId) {

        String invoiceNumber = generateInvoiceNumber(userId);

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .invoiceJson(req.getInvoiceJson())
                .user(userRepository.getReferenceById(userId))
                .build();

        return invoiceRepository.save(invoice);
    }

    // ===================== INVOICE NUMBER GENERATOR =====================
    @Transactional
    protected String generateInvoiceNumber(Long userId) {

        int year = Year.now().getValue();

        InvoiceSequence seq = sequenceRepository
                .findByUserIdAndYear(userId, year)
                .orElseGet(() -> {
                    InvoiceSequence s = new InvoiceSequence();
                    s.setUserId(userId);
                    s.setYear(year);
                    s.setLastNumber(0);
                    return s;
                });

        seq.setLastNumber(seq.getLastNumber() + 1);
        sequenceRepository.save(seq);

        return String.format("INV-%d-%03d", year, seq.getLastNumber());
    }

    // ===================== GET USER INVOICES =====================
    @Override
    public List<Invoice> getInvoiceByUser(Long userId) {
        return invoiceRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ===================== GET INVOICE BY ID =====================
    @Override
    public Optional<Invoice> getInvoiceById(Long id, Long userId) {
        return invoiceRepository.findByIdAndUserId(id, userId);
    }

    @Override
    public Page<Invoice> getInvoicesPaginated(Long userId, int page, int size) {
        return invoiceRepository.findByUserIdOrderByCreatedAtDesc(
                userId,
                PageRequest.of(page, size)
        );
    }

    // ===================== UPDATE INVOICE =====================
    @Override
    @Transactional
    public Invoice updateInvoice(Long id, InvoiceRequestDTO req, Long userId) {
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Invoice not found with id: " + id));

        invoice.setInvoiceJson(req.getInvoiceJson());

        return invoiceRepository.save(invoice);
    }

    // ===================== DELETE INVOICE =====================
    @Override
    @Transactional
    public void deleteInvoice(Long id, Long userId) {
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Invoice not found with id: " + id));

        invoiceRepository.delete(invoice);
    }
}
