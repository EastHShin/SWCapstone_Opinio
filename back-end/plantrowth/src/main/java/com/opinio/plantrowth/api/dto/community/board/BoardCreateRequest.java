package com.opinio.plantrowth.api.dto.community.board;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class BoardCreateRequest {
    private String title;
    private String content;
    private LocalDate date;

}
