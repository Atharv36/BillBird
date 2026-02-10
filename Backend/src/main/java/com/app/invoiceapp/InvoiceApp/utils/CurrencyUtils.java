package com.app.invoiceapp.InvoiceApp.utils;

import java.util.HashMap;
import java.util.Map;

public class CurrencyUtils {

    private static final Map<String, String> currencySymbols = new HashMap<>();

    static {
        currencySymbols.put("USD", "$");
        currencySymbols.put("EUR", "€");
        currencySymbols.put("GBP", "£");
        currencySymbols.put("JPY", "¥");
        currencySymbols.put("AUD", "A$");
        currencySymbols.put("CAD", "C$");
        currencySymbols.put("CHF", "Fr");
        currencySymbols.put("CNY", "¥");
        currencySymbols.put("SEK", "kr");
        currencySymbols.put("NZD", "NZ$");
        currencySymbols.put("MXN", "$");
        currencySymbols.put("SGD", "S$");
        currencySymbols.put("HKD", "HK$");
        currencySymbols.put("NOK", "kr");
        currencySymbols.put("KRW", "₩");
        currencySymbols.put("TRY", "₺");
        currencySymbols.put("RUB", "₽");
        currencySymbols.put("INR", "₹");
        currencySymbols.put("BRL", "R$");
        currencySymbols.put("ZAR", "R");
        currencySymbols.put("AED", "د.إ");
        currencySymbols.put("SAR", "﷼");
        currencySymbols.put("THB", "฿");
        currencySymbols.put("MYR", "RM");
        currencySymbols.put("IDR", "Rp");
        currencySymbols.put("PHP", "₱");
        currencySymbols.put("CZK", "Kč");
        currencySymbols.put("PLN", "zł");
        currencySymbols.put("DKK", "kr");
        currencySymbols.put("HUF", "Ft");
        currencySymbols.put("ILS", "₪");
        currencySymbols.put("CLP", "CLP$");
        currencySymbols.put("PEN", "S/");
        currencySymbols.put("COP", "COL$");
        currencySymbols.put("ARS", "ARS$");
        currencySymbols.put("EGP", "£");
        currencySymbols.put("KES", "KSh");
        currencySymbols.put("NGN", "₦");
        currencySymbols.put("Other", "¤");
    }

    public static String getCurrencySymbol(String currencyCode) {
        if (currencyCode == null || currencyCode.trim().isEmpty()) {
            return "₹"; // Default to INR
        }
        String symbol = currencySymbols.getOrDefault(currencyCode.toUpperCase(), "₹");
        return symbol != null ? symbol : "₹"; // Ensure we never return null
    }
}
