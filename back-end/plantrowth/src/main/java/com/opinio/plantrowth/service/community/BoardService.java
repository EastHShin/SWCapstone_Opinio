package com.opinio.plantrowth.service.community;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.api.dto.community.board.BoardCreateRequest;
import com.opinio.plantrowth.api.dto.community.board.BoardLookUpDTO;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.BoardLike;
import com.opinio.plantrowth.repository.community.BoardLikeRepository;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PlantRepository plantRepository;

    @Transactional
    public Long createBoard(Board board){

        Board createdBoard = boardRepository.save(board);
        return createdBoard.getId();
    }
    public BoardLookUpDTO LookUpBoard(Long boardId, Long userId){
        Board board = findBoard(boardId);
        BoardLookUpDTO page = new BoardLookUpDTO();
        page.setTitle(board.getTitle());
        page.setContent(board.getContent());
        page.setCreateDate(board.getCreateDate());
        page.setUpdateDate(board.getUpdateDate());
        page.setFile_name(board.getFilename());
        page.setBoardLike(boardLikeRepository.existsByUserIdAndBoardId(userId,boardId));
        page.setWriter(board.getUser().getName());
        page.setCountedLike(countedLike(board.getId()));
        page.setComments(board.getComments());
        page.setUserId(board.getUser().getId());
        page.setCountedComments(countedCommentByBoardId(boardId));

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
        if(!(dto.getTitle()==null)) {
            board.setTitle(dto.getTitle());
        }
        if(!(dto.getContent()==null)) {
            board.setContent(dto.getContent());
        }
        if(!(dto.getDate()==null)) {
            board.setUpdateDate(dto.getDate());
        }

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
//    public Integer getWriterLv(Long userId){
//        List<Plant> plants = plantRepository.findAllByUserId(userId);
//        List<Integer> plantsLv = plants.stream().
//        Integer lv = Collections.max(
//
//    }


    /**
     *  댓글 갯수 조회
     */
    public Integer countedCommentByBoardId(Long boardId){
        Integer countedComment = commentRepository.countByBoardId(boardId);
        return countedComment;
    }
    /**
     * 좋아요 기능
     * @param userId
     * @param boardId
     */
    @Transactional
    public Integer boardLike(Long userId, Long boardId){
        if(boardLikeRepository.existsByUserIdAndBoardId(userId, boardId)){
            Long boardLikeId =boardLikeRepository.findByUserIdAndBoardId(userId, boardId)
                    .orElseThrow(() -> new RuntimeException())
                    .getId();


            boardLikeRepository.deleteById(boardLikeId);
            return 0;
        }
        else{
            boardLikeRepository.save(
                    BoardLike.builder()
                            .board(boardRepository.getById(boardId))
                            .user(userRepository.getById(userId))
                            .build());
            return 1;
        }
    }

    public Integer countedLike(Long boardId){
        Integer countedLike = boardLikeRepository.countByBoardId(boardId);
        return countedLike;
    }

}
