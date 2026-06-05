package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.AdminPartyResponse;
import bg.fmi.polyhub.dto.admin.RejectPartyRequest;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyStatus;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.mappers.PartyMapper;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PartyStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPartyService {

    private final PartyRepository partyRepository;
    private final PartyStatusRepository partyStatusRepository;
    private final PartyMapper partyMapper;

    public List<AdminPartyResponse> getAllParties() {
        return partyRepository.findAllByDeletedAtIsNull()
                .stream()
                .map(partyMapper::toAdminPartyResponse)
                .toList();
    }

    public AdminPartyResponse getParty(Long id) {
        return partyMapper.toAdminPartyResponse(findActiveParty(id));
    }

    public AdminPartyResponse approveParty(Long id) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.PENDING) {
            throw new RuntimeException("Only pending parties can be approved");
        }

        party.setStatus(getStatus(PartyStatusType.APPROVED));
        party.setRejectionComment(null);
        return partyMapper.toAdminPartyResponse(partyRepository.save(party));
    }

    public AdminPartyResponse rejectParty(Long id, RejectPartyRequest request) {
        Party party = findActiveParty(id);

        if (party.getStatus().getName() != PartyStatusType.PENDING) {
            throw new RuntimeException("Only pending parties can be rejected");
        }

        party.setStatus(getStatus(PartyStatusType.REJECTED));
        party.setRejectionComment(request.comment());
        return partyMapper.toAdminPartyResponse(partyRepository.save(party));
    }

    public void deleteParty(Long id) {
        Party party = findActiveParty(id);
        party.setDeletedAt(LocalDateTime.now());
        partyRepository.save(party);
    }

    private Party findActiveParty(Long id) {
        return partyRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Party not found"));
    }

    private PartyStatus getStatus(PartyStatusType type) {
        return partyStatusRepository.findByName(type)
                .orElseThrow(() -> new RuntimeException("Status not found"));
    }
}