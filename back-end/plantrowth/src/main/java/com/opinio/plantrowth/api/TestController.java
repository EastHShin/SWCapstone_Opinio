package com.opinio.plantrowth.api;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "test api";
    }

    @GetMapping("/health-check")
    public String healthCheck() {
        return "healthy";
    }
}
