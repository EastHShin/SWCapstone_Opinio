package com.opinio.plantrowth.api.dto.community.board;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class BoardDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String filename;
    private Long board_id;
    private String writer;
}
