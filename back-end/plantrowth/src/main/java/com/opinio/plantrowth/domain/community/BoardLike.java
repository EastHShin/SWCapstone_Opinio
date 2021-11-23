package com.opinio.plantrowth.domain.community;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opinio.plantrowth.domain.User;
import lombok.*;

import javax.persistence.*;

@NoArgsConstructor
@Entity
@Getter
@Setter
public class BoardLike {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private stateEnum state;
    public enum stateEnum{
        LIKE(1, "Like"),
        UNLIKE(0, "UnLike");
        Integer stateCode;
        String state;
        stateEnum(Integer stateCode, String state){
            this.stateCode = stateCode;
            this.state = state;
        }
    }

    @Builder
    public BoardLike(Board board, User user){
        this.board = board;
        this.user = user;
    }

}
