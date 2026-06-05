package bg.fmi.polyhub.dto.party;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record SubmitPartyRequest(
        @NotBlank
        String name,

        @NotBlank
        String description,

        String motto,
        String logoUrl,
        LocalDate foundedOn
) {}
