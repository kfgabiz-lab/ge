package com.ge.bo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ge.bo.entity.AdminUser;
import com.ge.bo.repository.AdminRepository;

@SpringBootApplication
public class BoApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoApplication.class, args);
    }

}
