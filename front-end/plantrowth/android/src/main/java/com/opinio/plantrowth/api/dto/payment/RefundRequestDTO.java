package com.opinio.plantrowth.api.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefundRequestDTO {
	private String merchant_uid;
	private Integer cancel_request_amount;
	private String reason;
}
