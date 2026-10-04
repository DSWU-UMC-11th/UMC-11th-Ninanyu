// src/main/java/com/umc/study/service/RentalService.java
package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;   // 세미콜론 추가

    public void createRental(Map<String, Object> body) {
        rentalRepository.save(body);                   // 소문자로 호출
    }

}