package com.opinio.plantrowth.api.dto.community.board;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BoardLookUpDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String file_name;
}
