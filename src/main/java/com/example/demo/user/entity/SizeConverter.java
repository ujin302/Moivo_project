package com.example.demo.user.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

// 11.26 - yjy
@Converter(autoApply = true)
public class SizeConverter implements AttributeConverter<com.example.demo.user.entity.Size, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Size size) {
        if (size == null) return null;

        switch (size) {
            case S:
                return 1;
            case M:
                return 2;
            case L:
                return 3;
            default:
                throw new IllegalArgumentException("적절하지 않은 사이즈: " + size);
        }
    }

    @Override
    public Size convertToEntityAttribute(Integer dbData) {
        if (dbData == null) return null;

        switch (dbData) {
            case 1:
                return Size.S;
            case 2:
                return Size.M;
            case 3:
                return Size.L;
            default:
                throw new IllegalArgumentException("DB에는 없는 사이즈: " + dbData);
        }
    }
}

