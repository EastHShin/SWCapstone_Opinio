package com.opinio.plantrowth.api.controller.admin;


import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.api.dto.admin.AdminBoardListDto;
import com.opinio.plantrowth.api.dto.admin.AdminBoardLookUpDto;
import com.opinio.plantrowth.api.dto.community.board.BoardLookUpDTO;
import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.community.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminCommunityApiController {
    private final BoardService boardService;
    private final CommentService commentService;

    @GetMapping("/api/admin/community/{board-id}")
    public ResponseEntity LookUpBoard(@PathVariable("board-id") Long boardId){
        Board board = boardService.findBoard(boardId);
        List<CommentLookUpDTO> comments = commentService.LookUpComment(board.getComments());
        AdminBoardLookUpDto page = new AdminBoardLookUpDto(board, comments);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("게시글 조회 성공");
        message.setData(page);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @DeleteMapping("/api/admin/community/{board-id}")
    public ResponseEntity deleteBoard(@PathVariable("board-id") Long boardId){
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/api/admin/community/comments/{comment-id}")
    public ResponseEntity deleteComment(@PathVariable("comment-id") Long commentId){
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/admin/community")
    public ResponseEntity viewBoard(){
        List<Board> boards = boardService.BoardList();
        List<AdminBoardListDto> collect = boards.stream()
                .map(board -> new AdminBoardListDto(board))
                .collect(Collectors.toList());
        Message message = new Message();
        message.setMessage("게시글 조회");
        message.setData(collect);
        message.setStatus(Message.StatusEnum.OK);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(message, headers, HttpStatus.OK);

    }
}
