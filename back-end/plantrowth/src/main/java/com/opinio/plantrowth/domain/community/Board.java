package com.opinio.plantrowth.domain.community;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opinio.plantrowth.domain.user.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    private String title;
    private String content;
    private LocalDate createDate;
    private LocalDate updateDate;
    private String filename;
    private String noticeYn;
    @OneToMany(fetch=FetchType.LAZY, cascade = CascadeType.MERGE, mappedBy = "board")
    @Builder.Default
    List<Comment> comments = new ArrayList<>();

    @OneToMany(fetch=FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "board")
    @Builder.Default
    List<BoardLike> boardLikes = new ArrayList<>();

}
