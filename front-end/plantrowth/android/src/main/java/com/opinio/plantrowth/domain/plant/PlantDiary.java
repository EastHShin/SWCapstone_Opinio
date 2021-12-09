package com.opinio.plantrowth.domain.plant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opinio.plantrowth.domain.plant.Plant;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter @Setter
public class PlantDiary {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Long id;
/*

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
*/

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "plant_id")
    @JsonIgnore
    private Plant plant;

    private String title;
    @Column(length = 1000)
    private String content;
    private LocalDate date;
    private String filename;
}
