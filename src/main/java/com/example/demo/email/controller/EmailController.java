package com.example.demo.email.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.email.dto.EmailDTO;
import com.example.demo.email.dto.OrderDetails;
import com.example.demo.email.service.EmailService;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/mail")
@RestController
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String FROM_ADDRESS = "jomin5151@gmail.com";
    //private static final String toAddress = "jomin5151@gmail.com";

    @PostMapping("/success")
    public ResponseEntity<String> sendPaymentSuccessMail(@RequestBody OrderDetails orderDetails) {
        try {
            String mailSubject = "결제가 완료되었습니다! 상품을 안전히 배송해드릴게요.";
            String mailContent = String.format(
                "<html>" +
                "<body style='font-family: Arial, sans-serif;'>" +
                "    <h2 style='color: #2c3e50;'>안녕하세요, %s님!</h2>" +
                "    <p>주문 번호: <strong>%s</strong></p>" +
                "    <p>결제자: <strong>%s</strong></p>" +
                "    <p>상품 이름: <strong>%s</strong></p>" +
                "    <p>결제 금액: <strong>%s 원</strong></p>" +
                "    <p>배송지: <strong>%s</strong></p>" +
                "    <p>배송 현황: <span style='color: #16a085;'>%s</span></p>" +
                "    <p>감사합니다.</p>" +
                "</body>" +
                "</html>",
                orderDetails.getCustomerName(),
                orderDetails.getOrderId(),
                orderDetails.getCustomerName(),
                orderDetails.getOrderName(),
                orderDetails.getAmount(),
                orderDetails.getAddr(),
                orderDetails.getDeliverystatus()
            );

            emailService.sendMail(new EmailDTO(orderDetails.getToAddress(), FROM_ADDRESS, mailSubject, mailContent, true));

            return ResponseEntity.ok("Email sent successfully.");
        } catch (Exception e) {
            logger.error("Failed to send email", e);
            return ResponseEntity.status(500).body("Failed to send email.");
        }
    }
}
