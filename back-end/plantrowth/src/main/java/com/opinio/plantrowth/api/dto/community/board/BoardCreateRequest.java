package com.opinio.plantrowth.api.dto.community.board;

import com.opinio.plantrowth.domain.community.Board;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardCreateRequest {
    private String title;
    private String content;
    private Boolean file_delete;

    public BoardCreateRequest(String title, String content, Boolean file_delete){
        this.title = title;
        this.content = content;
        this.file_delete = file_delete;
    }
    public Board toEntity(){
        return Board.builder()
                .title(title)
                .content(content)
                .build();
    }
}
