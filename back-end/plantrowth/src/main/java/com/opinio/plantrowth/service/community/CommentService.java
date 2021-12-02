package com.opinio.plantrowth.service.community;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.plant.PlantRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;
	private final PlantRepository plantRepository;


	@Transactional
	public Long createComment(Comment comment) {

		Long commentId = commentRepository.save(comment).getId();
		return commentId;
	}

	public List<CommentLookUpDTO> LookUpComment(List<Comment> comments) {
		List<CommentLookUpDTO> collect = comments.stream()
			.map(m -> new CommentLookUpDTO(m, getUserLevel(m.getUser().getId())))
			.collect(Collectors.toList());
		return collect;
	}

	public Comment findComment(Long commentId) {
		return commentRepository.findById(commentId).
			orElseThrow(() -> new IllegalArgumentException("해당 댓글을 찾을 수 없습니다."));
	}

	public List<Comment> findCommentsByUserId(Long userId) {
		return commentRepository.findAllByUserId(userId);
	}

	public List<Comment> findCommentsByBoardID(Long boardId) {
		return commentRepository.findAllByBoardId(boardId);
	}

	@Transactional
	public Long updateComment(Long id, CommentCUDto dto) {
		Comment comment = commentRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글 입니다."));

		comment.setContent(dto.getContent());
		comment.setDate(LocalDateTime.now());
		comment.setIsUpdate(true);

		return comment.getId();
	}

	@Transactional
	public void deleteComment(Long id) {
		Comment comment = commentRepository.findById(id).
			orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글 입니다."));
		commentRepository.delete(comment);
	}

	public Integer getUserLevel(Long userId) {
		Integer lv = plantRepository.findPlantLevelByUserId(userId).stream().mapToInt(x -> x).max().orElseThrow(
			NoSuchElementException::new);
		return lv;
	}

}
