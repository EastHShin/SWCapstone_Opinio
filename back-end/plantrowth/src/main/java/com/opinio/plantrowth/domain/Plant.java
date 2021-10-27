package com.opinio.plantrowth.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@NoArgsConstructor
@Entity
@Getter @Setter
public class Plant {

    @Id @GeneratedValue
    @Column(name = "plant_id")
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;      //User 클래스 완성하면 풀기
    private String plantSpecies;
    private String plantName;
    private LocalDate plantBirth;
    private int plantExp;
    private String fileName;
    private int waterSupply;
    private int alarmCycle;

    @Builder
    public Plant(String plantSpecies, String plantName, LocalDate plantBirth, int plantExp, String fileName, int waterSupply, int alarmCycle) {
        this.plantSpecies = plantSpecies;
        this.plantName = plantName;
        this.plantBirth = plantBirth;
        this.plantExp = plantExp;
        this.fileName = fileName;
        this.waterSupply = waterSupply;
        this.alarmCycle = alarmCycle;
    }
}
