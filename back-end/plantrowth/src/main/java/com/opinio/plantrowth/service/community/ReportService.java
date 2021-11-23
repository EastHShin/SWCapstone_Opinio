package com.opinio.plantrowth.service.community;

import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.community.ReportRepository;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    @Transactional
    public Long BoardReport(Long boardId, Long userId){
        Report report = Report.builder()
                .user(userRepository.getById(userId))
                .board(boardRepository.getById(boardId))
                .date(LocalDate.now())
                .state(Report.StateEnum.NOTPROCESSED)
                .build();
        Long reportId = reportRepository.save(report).getId();
        return reportId;
    }
    @Transactional
    public Long CommentReport(Long commentId, Long userId){
        Report report = Report.builder()
                .user(userRepository.getById(userId))
                .comment(commentRepository.getById(commentId))
                .date(LocalDate.now())
                .state(Report.StateEnum.NOTPROCESSED)
                .build();
        Long reportId = reportRepository.save(report).getId();
        return reportId;
    }

    public List<Report> ViewReport(){

    }
}
