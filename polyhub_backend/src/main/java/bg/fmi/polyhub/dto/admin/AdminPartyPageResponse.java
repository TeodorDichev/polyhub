package bg.fmi.polyhub.dto.admin;

import java.util.List;

public record AdminPartyPageResponse(
        List<PartyAdminResponse> parties,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
