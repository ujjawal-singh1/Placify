package com.Placify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication
public class PlacifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlacifyApplication.class, args);
	}

}
