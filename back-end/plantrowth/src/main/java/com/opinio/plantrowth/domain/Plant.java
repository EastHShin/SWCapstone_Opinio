package com.opinio.plantrowth.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@Builder
@Entity
@Getter @Setter
@NoArgsConstructor
public class Plant {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plant_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String plantSpecies;
    private String plantName;
    private LocalDate plantBirth;
    private Integer plantExp;
    private String fileName;
    private Integer waterSupply;
    private Integer alarmCycle;
    private LocalDate recentWatering;

//    @Builder
//    public Plant(String plantSpecies, String plantName, LocalDate plantBirth, int plantExp, String fileName, int waterSupply, int alarmCycle) {
//        this.plantSpecies = plantSpecies;
//        this.plantName = plantName;
//        this.plantBirth = plantBirth;
//        this.plantExp = plantExp;
//        this.fileName = fileName;
//        this.waterSupply = waterSupply;
//        this.alarmCycle = alarmCycle;
//    }
}
