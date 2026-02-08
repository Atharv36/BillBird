package com.app.invoiceapp.InvoiceApp.controller;

import com.app.invoiceapp.InvoiceApp.dto.InvoiceRequestDTO;
import com.app.invoiceapp.InvoiceApp.ratelimit.RateLimit;
import com.app.invoiceapp.InvoiceApp.dto.InvoiceResponseDTO;
import com.app.invoiceapp.InvoiceApp.entity.Invoice;
import com.app.invoiceapp.InvoiceApp.security.services.UserDetailsImpl;
import com.app.invoiceapp.InvoiceApp.service.InvoicePdfService;
import com.app.invoiceapp.InvoiceApp.service.InvoiceService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoicePdfService invoicePdfService;

    @Autowired
    private ModelMapper modelMapper;

    // ===================== CREATE INVOICE =====================
    @PostMapping("/create")
    public ResponseEntity<?> createInvoice(
            @RequestBody InvoiceRequestDTO req,
            Authentication auth
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        Invoice saved = invoiceService.createInvoice(req, user.getId());

        return ResponseEntity.ok(saved);
    }

    // ===================== GET ALL INVOICES =====================
    @GetMapping("/all")
    public ResponseEntity<?> getMyInvoices(Authentication auth) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        List<InvoiceResponseDTO> dtoList =
                invoiceService.getInvoiceByUser(user.getId())
                        .stream()
                        .map(invoice -> modelMapper.map(invoice, InvoiceResponseDTO.class))
                        .toList();

        return ResponseEntity.ok(dtoList);
    }

    // ===================== GET INVOICE BY ID =====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(
            @PathVariable Long id,
            Authentication auth
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        Invoice invoice = invoiceService
                .getInvoiceById(id, user.getId())
                .orElseThrow(() ->
                        new com.app.invoiceapp.InvoiceApp.exception.NotFoundException("No invoice found with id: " + id));

        InvoiceResponseDTO dto =
                modelMapper.map(invoice, InvoiceResponseDTO.class);

        return ResponseEntity.ok(dto);
    }

    // ===================== DOWNLOAD PDF =====================
    @GetMapping("/{id}/pdf")
    @RateLimit(requests = 5, timeWindow = 60) // 10 requests per minute
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Long id,
            Authentication auth
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        Invoice invoice = invoiceService
                .getInvoiceById(id, user.getId())
                .orElseThrow(() ->
                        new com.app.invoiceapp.InvoiceApp.exception.NotFoundException("Invoice not found"));

        byte[] pdf = invoicePdfService.generatePdf(invoice);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + invoice.getInvoiceNumber() + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ===================== GENERATE PDF (PREVIEW) =====================
    @PostMapping("/pdf")
    @RateLimit(requests = 5, timeWindow = 60) // 10 requests per minute
    public ResponseEntity<byte[]> generatePdf(
            @Valid @RequestBody InvoiceRequestDTO request
    ) {
        byte[] pdfBytes = invoicePdfService.generatePdfFromJson(
                request.getInvoiceNumber(),
                request.getInvoiceJson()
        );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=" + request.getInvoiceNumber() + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }



    @GetMapping("/paginated")
    public ResponseEntity<?> getInvoicesPaginated(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        Page<Invoice> invoicePage =
                invoiceService.getInvoicesPaginated(user.getId(), page, size);

        return ResponseEntity.ok(invoicePage);
    }

    // ===================== UPDATE INVOICE =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(
            @PathVariable Long id,
            @RequestBody InvoiceRequestDTO req,
            Authentication auth
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        try {
            Invoice updated = invoiceService.updateInvoice(id, req, user.getId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // ===================== DELETE INVOICE =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(
            @PathVariable Long id,
            Authentication auth
    ) {
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        try {
            invoiceService.deleteInvoice(id, user.getId());
            return ResponseEntity.ok("Invoice deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
