package com.opinio.plantrowth.domain.community;


import com.opinio.plantrowth.domain.user.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

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
