package bg.fmi.polyhub.dto.specialist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePolicyRequest(
        @NotBlank(message = "Policy name cannot be blank")
        String name,

        @NotBlank(message = "Slug for policy cannot be blank")
        String slug,

        @NotNull(message = "Please provide proper political positioning")
        Double specEconomicAxis,

        @NotNull(message = "Please provide proper political positioning")
        Double specSocialAxis) {

}
