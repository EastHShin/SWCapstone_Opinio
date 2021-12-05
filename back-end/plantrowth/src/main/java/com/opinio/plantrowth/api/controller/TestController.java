package com.opinio.plantrowth.api.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping("/test")
    public ResponseEntity healthCheckPost(@RequestBody String tt){
        return ResponseEntity.ok().body("fff");
    }

}
