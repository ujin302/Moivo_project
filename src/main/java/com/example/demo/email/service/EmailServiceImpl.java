package com.example.demo.email.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.demo.email.dto.EmailDTO;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeUtility;

@Service
public class EmailServiceImpl implements EmailService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    @Override
    public void sendMail(EmailDTO emailDTO) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // 수신자 정보 추가
            mimeMessageHelper.setTo(emailDTO.getToAddress());

            // 제목과 내용 설정
            mimeMessageHelper.setSubject(MimeUtility.encodeText(emailDTO.getSubject(), "UTF-8", "B"));
            mimeMessageHelper.setText(emailDTO.getContent(), emailDTO.isUseHtmlYn());

            // 발신자 정보 설정
            mimeMessageHelper.setFrom(emailDTO.getFromAddress());

            // 이메일 전송
            javaMailSender.send(mimeMessage);

            logger.info("Email successfully sent to: {}", emailDTO.getFromAddress());
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", emailDTO.getFromAddress(), e);
        }
    }
}
