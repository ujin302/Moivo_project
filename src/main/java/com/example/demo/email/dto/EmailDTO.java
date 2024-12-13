package com.example.demo.email.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailDTO {
    private String toAddress;
    private String fromAddress;
    private String subject;
    private String content;
    private boolean isUseHtmlYn;
}
