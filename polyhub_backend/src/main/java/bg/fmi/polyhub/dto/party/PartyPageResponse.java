package bg.fmi.polyhub.dto.party;

import java.util.List;

public record PartyPageResponse(
        List<PartyListItemResponse> parties,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}