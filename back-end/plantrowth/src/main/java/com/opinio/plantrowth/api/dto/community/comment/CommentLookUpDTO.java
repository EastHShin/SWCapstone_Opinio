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
    private Boolean is_blocked;

    public CommentLookUpDTO(Comment comment){
        content = comment.getContent();
        date = comment.getDate();
        is_blocked = comment.getIsBlocked();
    }
}
