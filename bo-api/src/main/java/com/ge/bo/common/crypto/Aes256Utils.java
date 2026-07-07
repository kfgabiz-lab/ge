package com.ge.bo.common.crypto;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class Aes256Utils {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";

    private static final int KEY_SIZE = 32;
    private static final int IV_SIZE = 16;

    private final Aes256Properties aes256Properties;

    public String encrypt(String plainText) {
        try {
            validateKeyAndIv();

            byte[] keyBytes = aes256Properties.getConnectPortalEncKey().getBytes(StandardCharsets.UTF_8);
            byte[] ivBytes = aes256Properties.getConnectPortalIv().getBytes(StandardCharsets.UTF_8);

            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);
            IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);

            byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {
            throw new RuntimeException("AES256 encryption failed", e);
        }
    }

    public String decrypt(String encryptedText) {
        try {
            validateKeyAndIv();

            byte[] keyBytes = aes256Properties.getConnectPortalEncKey().getBytes(StandardCharsets.UTF_8);
            byte[] ivBytes = aes256Properties.getConnectPortalIv().getBytes(StandardCharsets.UTF_8);

            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);
            IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

            byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
            byte[] decrypted = cipher.doFinal(decodedBytes);

            return new String(decrypted, StandardCharsets.UTF_8);

        } catch (Exception e) {
            throw new RuntimeException("AES256 decryption failed", e);
        }
    }

    private void validateKeyAndIv() {
        String key = aes256Properties.getConnectPortalEncKey();
        String iv = aes256Properties.getConnectPortalIv();

        if (key == null || key.getBytes(StandardCharsets.UTF_8).length != KEY_SIZE) {
            throw new IllegalArgumentException("AES256 key must be 32 bytes.");
        }

        if (iv == null || iv.getBytes(StandardCharsets.UTF_8).length != IV_SIZE) {
            throw new IllegalArgumentException("AES256 iv must be 16 bytes.");
        }
    }
}
