package com.opinio.plantrowth.api.dto.community.board;

import java.time.LocalDateTime;
import java.util.List;

import com.opinio.plantrowth.domain.community.Comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardLookUpDTO {
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String writer;
    private Long userId;
    private String file_name;
    private boolean boardLike;
    private Integer countedLike;

    private Integer countedComments;
    private List<Comment> comments; // content, date, user_id, writer
}
