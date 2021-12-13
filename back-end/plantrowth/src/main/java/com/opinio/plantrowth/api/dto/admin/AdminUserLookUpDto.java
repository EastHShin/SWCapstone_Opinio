package com.opinio.plantrowth.api.dto.admin;

import com.opinio.plantrowth.domain.payment.PaymentRecord;
import com.opinio.plantrowth.domain.user.User;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
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
    private List<AdminPaymentRecord> paymentRecords;
    public AdminUserLookUpDto(User user){
        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        point = user.getPoint();
        plantNum = user.getPlantNum();
        maxPlantNum =user.getMaxPlantNum();
        subcription = user.getSubscription();
        paymentRecords = user.getPaymentRecords()
                .stream().map(paymentRecord -> new AdminPaymentRecord(paymentRecord))
                .collect(Collectors.toList());
    }
    @Data
    @NoArgsConstructor
    @Getter
    @Setter
    @AllArgsConstructor
    public class AdminPaymentRecord{
        private Long paymentId;
        private String impUid;
        private String merchantUid;
        private Integer amount;
        private Integer cancelAmount;
        private LocalDate date;
        private LocalDateTime dateTime;
        private Enum paymentType;
        private Enum paymentStatus;
        public AdminPaymentRecord(PaymentRecord paymentRecord){
            paymentId = paymentRecord.getId();
            impUid = paymentRecord.getImpUid();
            merchantUid =paymentRecord.getMerchantUid();
            amount = paymentRecord.getAmount();
            cancelAmount =paymentRecord.getCancelAmount();
            date =paymentRecord.getDate();
            dateTime = paymentRecord.getDateTime();
            paymentType = paymentRecord.getPaymentType();
            paymentStatus = paymentRecord.getPaymentStatus();
        }
    }

}
