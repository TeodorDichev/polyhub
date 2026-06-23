package bg.fmi.polyhub.dto.party;

import java.time.LocalDate;

public record PartyListItemResponse(
        Long id,
        String name,
        String description,
        String motto,
        String logoUrl,
        LocalDate foundedOn,
        Double specEconomicAxis,
        Double specSocialAxis,
        String politicalLabel
) {}