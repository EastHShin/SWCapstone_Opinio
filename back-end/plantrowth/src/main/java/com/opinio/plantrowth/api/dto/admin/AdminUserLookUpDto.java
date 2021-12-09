package com.opinio.plantrowth.api.dto.admin;

import com.opinio.plantrowth.domain.payment.PaymentRecord;
import com.opinio.plantrowth.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class AdminUserLookUpDto {
    private Long id;
    private String name;
    private String email;
    private Integer point;
    private Integer plantNum;
    private Integer maxPlantNum;
    private Boolean subcription;
    private List<PaymentRecord> paymentRecords;
    public AdminUserLookUpDto(User user){
        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        point = user.getPoint();
        plantNum = user.getPlantNum();
        maxPlantNum =user.getMaxPlantNum();
        subcription = user.getSubscription();
        paymentRecords = user.getPaymentRecords();
    }

}
