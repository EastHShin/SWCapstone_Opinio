package com.opinio.plantrowth.api.dto.community.board;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.Comment;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
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
    private List<CommentLookUpDTO> comments;

    public BoardLookUpDTO(Board board, boolean isLike, Integer numOfLike, Integer numOfComment) {
        title = board.getTitle();
        content = board.getContent();
        createDate = board.getCreateDate();
        updateDate = board.getUpdateDate();
        writer = board.getUser().getName();
        userId = board.getUser().getId();
        file_name = board.getFilename();
        boardLike = isLike;
        countedLike = numOfLike;
        countedComments = numOfComment;

        comments = board.getComments().stream()
            .map(comment -> new CommentLookUpDTO(comment))
            .collect(Collectors.toList());

    }

    // private List<Comment> comments;
}
