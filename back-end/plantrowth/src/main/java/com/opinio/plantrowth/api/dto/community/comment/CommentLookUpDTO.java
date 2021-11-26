package com.opinio.plantrowth.api.dto.community.comment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class CommentLookUpDTO {
    private String content;
    private LocalDate date;
}
