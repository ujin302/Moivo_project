package com.example.demo.email.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.email.dto.EmailDTO;
import com.example.demo.email.service.EmailService;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/mail")
@RestController
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String FROM_ADDRESS = "jomin5151@gmail.com";
    private static final String toAddress = "jomin5151@gmail.com";

    @PostMapping("/success")
    public ResponseEntity<String> sendPaymentSuccessMail() {
        try {
            String mailSubject = "결제가 완료되었습니다! 상품을 안전히 배송해드릴게요.";
            String mailContent = "<p>안녕하세요.</p><p>사용자의 상품 배송이 곧 시작됩니다.</p><p>감사합니다.</p>";

            emailService.sendMail(new EmailDTO(toAddress, FROM_ADDRESS, mailSubject, mailContent, true));

            return ResponseEntity.ok("Email sent successfully.");
        } catch (Exception e) {
            logger.error("Failed to send email", e);
            return ResponseEntity.status(500).body("Failed to send email.");
        }
    }
}
