package com.opinio.plantrowth.service.community;


import com.opinio.plantrowth.api.dto.community.board.BoardCreateRequest;
import com.opinio.plantrowth.api.dto.community.board.BoardLookUpDTO;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.BoardLike;
import com.opinio.plantrowth.repository.community.BoardLikeRepository;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLike;
    private final UserRepository userRepository;

    @Transactional
    public Long createBoard(Board board){

        Board createdBoard = boardRepository.save(board);
        return createdBoard.getId();
    }
    public BoardLookUpDTO LookUpBoard(Long id){
        Board board = findBoard(id);
        BoardLookUpDTO page = new BoardLookUpDTO();
        page.setTitle(board.getTitle());
        page.setContent(board.getContent());
        page.setDate(board.getDate());
        page.setFile_name(board.getFilename());

        return page;
    }
    public Board findBoard(Long boardId) {
        return boardRepository.findById(boardId).
                orElseThrow(()->new IllegalArgumentException("해당 게시글을 찾을 수 없습니다."));
    }

    public List<Board> findBoardsByUserId(Long userId){
        return boardRepository.findAllByUserId(userId);
    }
    public List<Board> BoardList(){return boardRepository.findAll();}
    @Transactional
    public Long updateBoard(Long id, BoardCreateRequest dto){
        Board board = boardRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 게시글 입니다."));
        if(!(dto.getTitle()==null))
            board.setTitle(dto.getTitle());
        if(!(dto.getContent()==null))
            board.setContent(dto.getContent());
        if(!(dto.getDate()==null))
            board.setDate(dto.getDate());

        return board.getId();
    }

    @Transactional
    public Long deleteBoard(Long id){
        Board board = boardRepository.findById(id).
                orElseThrow(()->new IllegalArgumentException("해당 게시글은 존재하지 않습니다"));
        boardRepository.delete(board);
        return id;
    }

    @Transactional
    public Long updateImage(Long id, String imageName){
        Board board = boardRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("존재하지 않는 게시글 입니다."));
        board.setFilename(imageName);

        return board.getId();
    }

    /**
     * 좋아요 기능
     * @param userId
     * @param boardId
     */

    public void addLike(Long userId, Long boardId){
        boardLike.findByUserIdAndBoardId(userId, boardId).ifPresent(none -> { throw new RuntimeException(); });
        boardLike.save(
                BoardLike.builder()
                        .board(boardRepository.getById(boardId))
                        .user(userRepository.getById(userId))
                        .build()
        );
    }

    public void deleteLike(Long userId, Long likeId, Long boardId){
        boardLike.findByUserIdAndBoardId(userId, boardId).orElseThrow(() -> new RuntimeException());
        boardLike.deleteById(likeId);
    }
}