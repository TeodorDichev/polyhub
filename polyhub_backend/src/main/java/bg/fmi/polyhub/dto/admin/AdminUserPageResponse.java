package bg.fmi.polyhub.dto.admin;

import java.util.List;

public record AdminUserPageResponse(
        List<AdminUserResponse> users,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {}
