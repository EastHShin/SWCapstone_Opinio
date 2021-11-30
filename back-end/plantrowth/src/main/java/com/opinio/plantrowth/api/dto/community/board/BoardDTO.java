package com.opinio.plantrowth.api.dto.community.board;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardDTO {
    private String title;
    private String content;
    private LocalDateTime createDate;
    private Long board_id;
    private String writer;
    private Integer countedLike;
    private Integer countedComments;
}
