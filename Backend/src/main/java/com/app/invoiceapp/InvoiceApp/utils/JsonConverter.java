package com.app.invoiceapp.InvoiceApp.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JsonConverter implements AttributeConverter<Object, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Object attribute) {
        try {
            return mapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting object to JSON", e);
        }
    }

    @Override
    public Object convertToEntityAttribute(String dbData) {
        try {
            return mapper.readValue(dbData, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to object", e);
        }
    }
}
