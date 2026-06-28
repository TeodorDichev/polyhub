package bg.fmi.polyhub.dto.specialist;

import java.util.List;

public record PartyForRatingPageResponse(
        List<PartyForRatingResponse> parties,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
