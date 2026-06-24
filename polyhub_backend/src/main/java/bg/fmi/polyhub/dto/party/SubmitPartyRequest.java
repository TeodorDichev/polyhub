package bg.fmi.polyhub.dto.party;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record SubmitPartyRequest(
        @NotBlank(message = "Party name cannot be blank")
        String name,

        @NotBlank(message = "Party description cannot be blank")
        String description,

        String motto,
        String logoUrl,
        LocalDate foundedOn
) {}
