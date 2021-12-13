package com.opinio.plantrowth.api.dto.admin;

import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.community.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminBoardLookUpDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private Long writerId;
    private String writerName;
    private List<CommentLookUpDTO> comments;

    public AdminBoardLookUpDto (Board board, List<CommentLookUpDTO> commentLookUpDTOS){
        id = board.getId();
        title = board.getTitle();
        content = board.getContent();
        createDate = board.getCreateDate();
        updateDate = board.getUpdateDate();
        writerId = board.getUser().getId();
        writerName = board.getUser().getName();
        comments = commentLookUpDTOS;

    }
}
