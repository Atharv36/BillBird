package com.app.invoiceapp.InvoiceApp.service;

import com.app.invoiceapp.InvoiceApp.entity.Invoice;
import com.app.invoiceapp.InvoiceApp.utils.CurrencyUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;

@Service
public class InvoicePdfService {

    private static final String PDF_FONT_PATH = "/fonts/NotoSans-Regular.ttf";
    private static final String PDF_FONT_FAMILY = "Noto Sans";

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private ObjectMapper objectMapper;

    // 🔥 MUST be Spring Transactional
    @Transactional(readOnly = true)
    public byte[] generatePdf(Invoice invoice) {

        if (invoice.getInvoiceJson() == null) {
            throw new RuntimeException("invoiceJson is null for invoice " + invoice.getId());
        }

        Map<String, Object> json =
                objectMapper.convertValue(invoice.getInvoiceJson(), Map.class);

        // Extract currency and get symbol
        String currencyCode = "INR"; // default
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> invoicing = (Map<String, Object>) json.get("invoicing");
            if (invoicing != null && invoicing.get("currency") != null) {
                currencyCode = invoicing.get("currency").toString();
            }
        } catch (Exception e) {
            // Keep default currency
        }
        String currencySymbol = CurrencyUtils.getCurrencySymbol(currencyCode);

        Context context = new Context();
        context.setVariable("invoice", invoice);
        context.setVariable("json", json);
        context.setVariable("currencySymbol", currencySymbol);

        String html = templateEngine.process("invoice", context);
        html = injectBaseFont(html);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            com.openhtmltopdf.pdfboxout.PdfRendererBuilder builder =
                    new com.openhtmltopdf.pdfboxout.PdfRendererBuilder();

            registerFont(builder);
            builder.withHtmlContent(html, null);
            builder.toStream(out);
            builder.run();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }

        return out.toByteArray();
    }

    public byte[] generatePdfFromJson(String invoiceNumber, Map<String, Object> invoiceJson) {

        // Extract currency and get symbol
        String currencyCode = "INR"; // default
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> invoicing = (Map<String, Object>) invoiceJson.get("invoicing");
            if (invoicing != null && invoicing.get("currency") != null) {
                currencyCode = invoicing.get("currency").toString();
            }
        } catch (Exception e) {
            // Keep default currency
        }
        String currencySymbol = CurrencyUtils.getCurrencySymbol(currencyCode);

        Context context = new Context();
        context.setVariable("invoiceNumber", invoiceNumber);
        context.setVariable("json", invoiceJson);
        context.setVariable("currencySymbol", currencySymbol);

        String html = templateEngine.process("guestInvoice", context);
        html = injectBaseFont(html);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            com.openhtmltopdf.pdfboxout.PdfRendererBuilder builder =
                    new com.openhtmltopdf.pdfboxout.PdfRendererBuilder();

            registerFont(builder);
            builder.withHtmlContent(html, null);
            builder.toStream(out);
            builder.run();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }

        return out.toByteArray();
    }

    private void registerFont(com.openhtmltopdf.pdfboxout.PdfRendererBuilder builder) {
        builder.useFont(() -> {
            InputStream stream = InvoicePdfService.class.getResourceAsStream(PDF_FONT_PATH);
            if (stream == null) {
                throw new IllegalStateException("Font not found: " + PDF_FONT_PATH);
            }
            return stream;
        }, PDF_FONT_FAMILY);
    }

    private String injectBaseFont(String html) {
        String style = "<style>body{font-family:'" + PDF_FONT_FAMILY + "', Arial, sans-serif;}</style>";
        String lower = html.toLowerCase();
        int headIndex = lower.indexOf("<head>");
        if (headIndex >= 0) {
            int insertPos = headIndex + "<head>".length();
            return html.substring(0, insertPos) + style + html.substring(insertPos);
        }
        return style + html;
    }
}
