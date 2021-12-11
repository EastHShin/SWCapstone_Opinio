package com.opinio.plantrowth.api.dto.admin;

import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.Report;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdminBoardListDto {
    private Long boardId;
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String filename;
    private Boolean isBlocked;
    private List<ReportDto> reports;

    public static class ReportDto{
        private Long reportId;
        private String reason;
        private LocalDate date;
        private Enum state;
        private Enum tag;
        public ReportDto(Report report){
            reportId = report.getId();
            reason = report.getReason();
            date = report.getDate();
            state = report.getState();
            tag = report.getTag();
        }
    }
    public AdminBoardListDto(Board board){
        boardId = board.getId();
        title = board.getTitle();
        content = board.getContent();
        createDate = board.getCreateDate();
        updateDate = board.getUpdateDate();
        filename = board.getFilename();
        isBlocked = board.getIsBlocked();
        reports = board.getReports()
                .stream()
                .map(report -> new ReportDto(report))
                .collect(Collectors.toList());
    }
}
