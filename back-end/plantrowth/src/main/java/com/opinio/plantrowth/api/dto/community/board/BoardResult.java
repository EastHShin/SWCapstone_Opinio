package com.opinio.plantrowth.api.dto.community.board;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardResult<T> {
    private T data;
}