package com.opinio.plantrowth.api.dto.community.comment;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CommentCreateRequest {
    private String content;
    private LocalDate date;
}
