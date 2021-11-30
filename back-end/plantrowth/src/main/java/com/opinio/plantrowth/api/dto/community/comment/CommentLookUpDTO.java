package com.opinio.plantrowth.api.dto.community.comment;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentLookUpDTO {
    private String content;
    private LocalDateTime date;
}
