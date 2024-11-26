package com.example.demo.user.entity;

// 11.26 - yjy
public enum Size {
    S(0), M(1), L(2); // TINYINT로 매핑할 값 지정

    private final int value;

    Size(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Size fromValue(int value) {
        for (Size size : Size.values()) {
            if (size.getValue() == value) {
                return size;
            }
        }
        throw new IllegalArgumentException("유호하지 않은 사이즈입니다: " + value);
    }
}
