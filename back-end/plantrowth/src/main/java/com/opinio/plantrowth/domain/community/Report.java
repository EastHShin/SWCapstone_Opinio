package com.opinio.plantrowth.domain.community;

import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.opinio.plantrowth.domain.user.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;
    private LocalDate date;
    private StateEnum state;
    private tagEnum tag;
    public enum StateEnum{
        NOTPROCESSED(0, "Not Processed"),
        PROCESSED(1, "Processed"),
        COMPLETE(2, "Complete");
        Integer stateCode;
        String stateMessage;
        StateEnum(Integer stateCode, String stateMessage){
            this.stateCode =stateCode;
            this.stateMessage = stateMessage;
        }
    }
    public enum tagEnum{
        BOARD(0, "boardReport"),
        COMMENT(1, "commentReport");
        Integer tagCode;
        String tagMessage;
        tagEnum(Integer tagCode, String tagMessage){
            this.tagCode = tagCode;
            this.tagMessage = tagMessage;
        }
    }
    @ManyToOne(fetch=FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch=FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(fetch=FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    private User user;


}
