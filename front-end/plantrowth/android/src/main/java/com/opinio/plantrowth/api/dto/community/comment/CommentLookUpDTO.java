package com.opinio.plantrowth.api.dto.community.comment;

import java.time.LocalDateTime;

import com.opinio.plantrowth.domain.community.Comment;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentLookUpDTO {
    private String content;
    private LocalDateTime date;
    private Long comment_id;
    private Long writer_id;
    private String writer;
    private Integer writer_level;
    private Boolean is_update;
    private Boolean is_blocked;

    public CommentLookUpDTO(Comment comment, Integer maxLevel){
        content = comment.getContent();
        date = comment.getDate();
        comment_id = comment.getId();
        writer_id = comment.getUser().getId();
        writer = comment.getUser().getName();
        writer_level = maxLevel;
        is_update = comment.getIsUpdate();
        is_blocked = comment.getIsBlocked();
    }
}
