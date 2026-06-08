package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyStatus;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.PartyMapper;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PartyStatusRepository;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final PartyStatusRepository partyStatusRepository;
    private final UserRepository userRepository;
    private final PartyMapper partyMapper;

    public PartyResponse submit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);

        if (user.getSuspendedOn() != null) { // could be moved on login ?
            throw new RuntimeException("Your account has been suspended");
        }

        partyRepository.findByCreatedByAndDeletedAtIsNull(user).ifPresent(existing -> {
            PartyStatusType status = existing.getStatus().getName();
            if (status == PartyStatusType.PENDING || status == PartyStatusType.APPROVED) {
                throw new RuntimeException("You already have an active or pending party");
            }
        });

        if (partyRepository.existsByNameAndDeletedAtIsNull(request.name())) {
            throw new RuntimeException("Party name already exists");
        }

        if (request.foundedOn().isAfter(LocalDate.now())) {
            throw new RuntimeException("Party cannot be created on this date");
        }

        PartyStatus pendingStatus = partyStatusRepository
                .findByName(PartyStatusType.PENDING)
                .orElseThrow(() -> new RuntimeException("Status PENDING not found"));

        Party party = partyMapper.toEntity(request);
        party.setStatus(pendingStatus);
        party.setCreatedBy(user);

        return partyMapper.toResponse(partyRepository.save(party));
    }

    public PartyResponse resubmit(SubmitPartyRequest request, String email) {
        User user = getActiveUser(email);

        if (user.getSuspendedOn() != null) {
            throw new RuntimeException("Your account has been suspended");
        }

        Party existing = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found to resubmit"));

        if (existing.getStatus().getName() != PartyStatusType.REJECTED) {
            throw new RuntimeException("Only rejected parties can be resubmitted");
        }

        if (request.foundedOn().isAfter(LocalDate.now())) {
            throw new RuntimeException("Party cannot be created on this date");
        }

        PartyStatus pendingStatus = partyStatusRepository
                .findByName(PartyStatusType.PENDING)
                .orElseThrow(() -> new RuntimeException("Status PENDING not found"));

        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setMotto(request.motto());
        existing.setLogoUrl(request.logoUrl());
        existing.setFoundedOn(request.foundedOn());
        existing.setStatus(pendingStatus);
        existing.setRejectionComment(null);

        return partyMapper.toResponse(partyRepository.save(existing));
    }

    public PartyResponse getMyParty(String email) {
        User user = getActiveUser(email);

        Party party = partyRepository
                .findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found"));

        return partyMapper.toResponse(party);
    }

    private User getActiveUser(String email) {
        return userRepository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}