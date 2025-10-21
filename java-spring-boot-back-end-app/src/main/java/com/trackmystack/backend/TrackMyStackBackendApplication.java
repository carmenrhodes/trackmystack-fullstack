package com.trackmystack.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.trackmystack.backend")
public class TrackMyStackBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackMyStackBackendApplication.class, args);
	}

}
