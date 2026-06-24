package bg.fmi.polyhub.dto.election;

import java.util.List;

public record ElectionPageResponse(
        List<ElectionResponse> elections,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}