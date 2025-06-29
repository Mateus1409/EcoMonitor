package com.sistema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MonitoramentoEconomiaApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonitoramentoEconomiaApplication.class, args);
    }
} 