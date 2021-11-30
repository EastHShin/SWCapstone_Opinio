package com.opinio.plantrowth.service.community;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.community.ReportRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

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
                .tag(Report.tagEnum.BOARD)
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
                .tag(Report.tagEnum.COMMENT)
                .build();
        Long reportId = reportRepository.save(report).getId();
        return reportId;
    }

    public List<Report> viewReports(){
        return reportRepository.findAll();
    }
    @Transactional
    public Report viewReport(Long reportId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(()-> new IllegalArgumentException("존재하지 않는 신고입니다."));
        report.setState(Report.StateEnum.PROCESSED);
        return report;
    }
    @Transactional
    public Report completeReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
        report.setState(Report.StateEnum.COMPLETE);
        return report;
    }
}
