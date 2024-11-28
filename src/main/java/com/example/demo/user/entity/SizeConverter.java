package com.example.demo.user.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SizeConverter implements AttributeConverter<Size, String> {

    @Override
    public String convertToDatabaseColumn(Size size) {
        if (size == null) return null;
        return size.name(); // S, M, L로 변환
    }

    @Override
    public Size convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;

        try {
            return Size.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("DB에 없는 사이즈: " + dbData, e);
        }
    }
}
