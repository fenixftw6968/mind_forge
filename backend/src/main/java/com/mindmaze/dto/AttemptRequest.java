package com.mindmaze.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptRequest {
    private Long puzzleId;
    private String userAnswer;
    private Boolean hintUsed;
    private Integer timeTakenSeconds;
}
