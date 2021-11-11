package com.opinio.plantrowth.api.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiaryResult<T> {
    private T data;
}
