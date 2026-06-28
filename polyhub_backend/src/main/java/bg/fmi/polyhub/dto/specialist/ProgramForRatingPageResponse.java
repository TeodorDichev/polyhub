package bg.fmi.polyhub.dto.specialist;

import java.util.List;

public record ProgramForRatingPageResponse(
        List<ProgramForRatingResponse> programs,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
