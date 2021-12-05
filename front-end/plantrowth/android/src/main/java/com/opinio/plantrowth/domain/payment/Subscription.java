package com.opinio.plantrowth.domain.payment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opinio.plantrowth.domain.user.User;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "subscribe_start")
    private LocalDate start;

    @Column(name = "subscribe_end")
    private LocalDate end;
}
