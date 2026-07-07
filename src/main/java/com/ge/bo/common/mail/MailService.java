package com.ge.bo.common.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendMail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom("abbgnog@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // false = plain text

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("메일 전송 실패", e);
        }
    }
}


