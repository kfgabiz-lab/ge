package com.ge.bo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;

import jakarta.annotation.PostConstruct;

import java.util.Arrays;

@Slf4j
@SpringBootApplication
public class BoApplication {

  @Autowired
  private ConfigurableEnvironment env;

  public static void main(String[] args) {
    SpringApplication.run(BoApplication.class, args);
  }

  @PostConstruct
  public void debugCors() {
    log.info("CORS 진단 시작");
    log.info("active profiles = {}", Arrays.toString(env.getActiveProfiles()));
    log.info("최종 cors.allowed-origins = [{}]", env.getProperty("cors.allowed-origins"));

    MutablePropertySources sources = env.getPropertySources();
    sources.forEach(ps -> {
      if (ps.containsProperty("cors.allowed-origins")) {
        log.info("출처[{}] => [{}]", ps.getName(), ps.getProperty("cors.allowed-origins"));
      }
    });
    log.info("CORS 진단 끝");
  }
}
