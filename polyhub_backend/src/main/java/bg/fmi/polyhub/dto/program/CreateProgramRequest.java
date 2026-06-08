package bg.fmi.polyhub.dto.program;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateProgramRequest(
        @NotBlank(message = "Title cannot be blank")
        String title,

        @NotBlank(message = "Content cannot be blank")
        String content,

        @NotNull(message = "Please provide proper political positioning")
        Double selfEconomicAxis,

        @NotNull(message = "Please provide proper political positioning")
        Double selfSocialAxis,

        List<Long> policyIds
) {}