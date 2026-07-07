package com.ge.bo.common.crypto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "ls.lse.in-api")
public class Aes256Properties {

    private String connectPortalEncKey;
    private String connectPortalIv;

}

