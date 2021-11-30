package com.opinio.plantrowth.api.controller.community;

import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.api.dto.community.board.BoardCreateRequest;
import com.opinio.plantrowth.api.dto.community.board.BoardDTO;
import com.opinio.plantrowth.api.dto.community.board.BoardLookUpDTO;
import com.opinio.plantrowth.api.dto.community.board.BoardResult;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.community.ReportService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.user.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BoardApiController {
    private final FileUploadService fileUploadService;
    private final BoardService boardService;
    private final UserService userService;
    private final String filePath = "board";
    private final ReportService reportService;

    @Transactional
    @GetMapping("/api/community/{user-id}/all") // 유저가 자신이 작성한 게시글 조회
    public ResponseEntity<BoardResult> boards(@PathVariable("user-id") Long id){
        List<Board> boards = boardService.findBoardsByUserId(id);
        List<BoardDTO> collect = boards.stream()
                .map(m -> new BoardDTO(m.getTitle(), m.getContent(), m.getCreateDate(),
                        m.getId(), m.getUser().getName(), boardService.countedLike(m.getId()),
                        boardService.countedCommentByBoardId(m.getId())))
                .collect(Collectors.toList());

        return new ResponseEntity<BoardResult>(new BoardResult(collect), HttpStatus.OK);
    }
    @Transactional
    @GetMapping("/api/community/") // 게시글 목록 조회
    public ResponseEntity<BoardResult> boardList(){
        List<Board> boards = boardService.BoardList();
        List<BoardDTO> collect = boards.stream()
                .map(m -> new BoardDTO(m.getTitle(), m.getContent(), m.getCreateDate(),
                        m.getId(), m.getUser().getName(), boardService.countedLike(m.getId()),
                        boardService.countedCommentByBoardId(m.getId())))
                .collect(Collectors.toList());

        return new ResponseEntity<BoardResult>(new BoardResult(collect), HttpStatus.OK);
    }

    /**
     * 게시글 CRUD
     */
    @Transactional
    @PostMapping(value = "/api/community/{user-id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createBoard(
            @PathVariable("user-id") Long userId,
            @ModelAttribute BoardCreateRequest dto,
            @RequestPart(name = "file_name", required = false) Optional<MultipartFile> file){
        Board board = Board.builder()
                .title(dto.getTitle())
                .createDate(LocalDateTime.now())
                .content(dto.getContent())
                .build();
        User user = userService.findUser(userId);
        board.setUser(user);
        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            board.setFilename(uploadImageName);
        }
        Long result = boardService.createBoard(board);
        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("게시글 작성 완료");

        return result !=null?
                new ResponseEntity<>(message, headers, HttpStatus.OK):
                ResponseEntity.badRequest().build();
    }

    @GetMapping("/api/community/view")
    public ResponseEntity<?> lookUpBoard(@RequestParam("board-id")Long boardId,
                                         @RequestParam("user-id")Long userId){
        BoardLookUpDTO board = boardService.LookUpBoard(boardId, userId);
        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("게시글 조회 성공");
        message.setData(board);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @PutMapping("/api/community/{board-id}")
    public ResponseEntity<?> updateBoard(@PathVariable("board-id") Long id,
                                         @ModelAttribute BoardCreateRequest dto,
                                         @RequestPart(name = "file_name", required = false) Optional<MultipartFile> file){
        Long updatedId = boardService.updateBoard(id, dto);
        Boolean isFileDelete =dto.getFile_delete();
        if(isFileDelete){
            boardService.updateImage(updatedId, null);
        }
        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            boardService.updateImage(updatedId, uploadImageName);
        }
        Board board = boardService.findBoard(updatedId);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("게시글이 수정되었습니다.");
        message.setData(board);
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("/api/community/{board-id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("board-id") Long id){
        Long result = boardService.deleteBoard(id);
        return result !=null?
                ResponseEntity.ok().body("게시글 삭제 완료"):
                ResponseEntity.badRequest().build();
    }


    /**
     * 게시글 좋아요 부분
     */
    @PostMapping("/api/community/like")
    public ResponseEntity<?> boardLike(@RequestParam("board-id")Long boardId,
                                       @RequestParam("user-id")Long userId) {
        Integer result = boardService.boardLike(userId, boardId);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        if (result == 1) message.setMessage("좋아요");
        else if (result ==0) message.setMessage("좋아요 취소");
        else message.setMessage("좋아요 기능 고장");

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @PostMapping("/api/community/report")//게시글 신고
    public ResponseEntity<?> reportBoard(@RequestParam("board-id")Long boardId,
                                         @RequestParam("user-id")Long userId){
        Long result = reportService.BoardReport(boardId, userId);
        return result!=null?
                ResponseEntity.ok().body("신고성공"):
                ResponseEntity.badRequest().body("신고실패");
    }
}
