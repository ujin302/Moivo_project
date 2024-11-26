package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

// @SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableScheduling // 스케줄러 기능 활성화
@ComponentScan(basePackages = {"com.example.demo", 
								"com.example.demo.congiguration", 
								"com.example.demo.jwt", 
								"com.example.demo.ncp", 
								"com.example.demo.payment", 
								"com.example.demo.qna", 
								"com.example.demo.store",
								"com.example.demo.user"})
@SpringBootApplication
public class MoivoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoivoApplication.class, args);
	}

}
