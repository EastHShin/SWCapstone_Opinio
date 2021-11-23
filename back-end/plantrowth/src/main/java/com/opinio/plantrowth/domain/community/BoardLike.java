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

    @ManyToOne(fetch=FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Builder
    public BoardLike(Board board, User user){
        this.board = board;
        this.user = user;
    }

}
