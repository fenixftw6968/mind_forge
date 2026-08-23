package com.mindmaze.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchSubmitRequest {
    private Integer score;
    private Integer timeTakenSeconds;
    private Integer mistakes;
    private String detailedAnswers;
}
