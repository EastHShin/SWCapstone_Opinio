package com.opinio.plantrowth.api.dto.subscription;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class BillingDTO {
    private String imp_uid;
    private String merchant_uid;
    private Long user_id;
}
