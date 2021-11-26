package com.opinio.plantrowth.api.dto.community.board;

import com.opinio.plantrowth.domain.community.Comment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class BoardLookUpDTO {
    private String title;
    private String content;
    private LocalDate createDate;
    private LocalDate updateDate;
    private String writer;
    private Long userId;
    private String file_name;
    private boolean boardLike;
    private Integer countedLike;

    private Integer countedComments;
    private List<Comment> comments; // content, date, user_id, writer
}
