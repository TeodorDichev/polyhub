package bg.fmi.polyhub.dto.election;

import bg.fmi.polyhub.entities.ElectionTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateElectionRequest(
        @NotBlank(message = "Name cannot be blank")
        String name,

        @NotNull(message = "Election date is required")
        LocalDate electionDate,

        @NotNull(message = "Election type is required")
        ElectionTypeEnum type,

        String description
) {}