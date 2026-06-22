package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.program.CreateProgramRequest;
import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.dto.program.ProgramSuggestion;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.entities.ProgramPolicy;
import bg.fmi.polyhub.entities.ProgramPolicyId;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.ProgramMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PolicyRepository;
import bg.fmi.polyhub.repositories.ProgramPolicyRepository;
import bg.fmi.polyhub.repositories.ProgramRepository;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bg.fmi.polyhub.dto.policy.PoliticalPositionType;
import bg.fmi.polyhub.dto.program.ProgramDetailsResponse;
import bg.fmi.polyhub.dto.program.ProgramPolicyDetailsResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final ProgramPolicyRepository programPolicyRepository;
    private final PolicyRepository policyRepository;
    private final PartyRepository partyRepository;
    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final ProgramMapper programMapper;

    public Optional<ProgramSuggestion> getSuggestion(String email) {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        return programRepository.findAllByPartyOrderByCreatedAtDesc(party)
                .stream()
                .findFirst()
                .map(prev -> {
                    List<Long> policyIds = programPolicyRepository
                            .findAllByProgram(prev)
                            .stream()
                            .map(pp -> pp.getPolicy().getId())
                            .toList();
                    return new ProgramSuggestion(
                            prev.getTitle(),
                            prev.getContent(),
                            prev.getSelfEconomicAxis(),
                            prev.getSelfSocialAxis(),
                            policyIds
                    );
                });
    }

    @Transactional // check if we need it on other service methods
    public ProgramResponse createOrUpdate(Long electionId, CreateProgramRequest request, String email) {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (election.getElectionDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot submit program for a past election");
        }

        Program program = programRepository.findByPartyAndElection(party, election)
                .orElseGet(() -> {
                    Program p = new Program();
                    p.setParty(party);
                    p.setElection(election);
                    p.setCreatedAt(LocalDateTime.now());
                    return p;
                });

        program.setTitle(request.title());
        program.setContent(request.content());
        program.setSelfEconomicAxis(request.selfEconomicAxis());
        program.setSelfSocialAxis(request.selfSocialAxis());
        program.setLastEditAt(LocalDateTime.now());

        Program saved = programRepository.save(program);

        // replace policies
        programPolicyRepository.deleteAllByProgram(saved);

        List<Policy> policies = policyRepository.findAllByIdIn(request.policyIds());
        policies.forEach(policy -> {
            ProgramPolicy pp = new ProgramPolicy();
            pp.setId(new ProgramPolicyId(saved.getId(), policy.getId()));
            pp.setProgram(saved);
            pp.setPolicy(policy);
            programPolicyRepository.save(pp);
        });

        List<ProgramPolicy> savedPolicies = programPolicyRepository.findAllByProgram(saved);
        return programMapper.toResponse(saved, savedPolicies);
    }

    public ProgramResponse getMyProgram(Long electionId, String email) {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        Program program = programRepository.findByPartyAndElection(party, election)
                .orElseThrow(() -> new RuntimeException("No program found for this election"));

        List<ProgramPolicy> policies = programPolicyRepository.findAllByProgram(program);
        return programMapper.toResponse(program, policies);
    }

    public ProgramDetailsResponse getDetails(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        List<ProgramPolicy> policies = programPolicyRepository.findAllByProgram(program);

        return new ProgramDetailsResponse(
                program.getId(),
                program.getTitle(),
                program.getContent(),

                program.getSelfEconomicAxis(),
                program.getSelfSocialAxis(),
                program.getSpecEconomicAxis(),
                program.getSpecSocialAxis(),

                program.getCreatedAt(),
                program.getLastEditAt(),

                program.getElection().getId(),
                program.getElection().getName(),
                program.getElection().getElectionDate(),

                program.getParty().getId(),
                program.getParty().getName(),
                program.getParty().getDescription(),
                program.getParty().getMotto(),

                policies.stream()
                        .map(this::toPolicyDetails)
                        .toList()
        );
    }

    private ProgramPolicyDetailsResponse toPolicyDetails(ProgramPolicy programPolicy) {
        Policy policy = programPolicy.getPolicy();

        PoliticalPositionType positionType = PoliticalPositionType.from(
                policy.getSpecEconomicAxis(),
                policy.getSpecSocialAxis()
        );

        return new ProgramPolicyDetailsResponse(
                policy.getId(),
                policy.getName(),
                policy.getSlug(),
                positionType != null ? positionType.name() : null,
                policy.getSpecEconomicAxis(),
                policy.getSpecSocialAxis()
        );
    }

    private User getActiveUser(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Party getApprovedParty(User user) {
        Party party = partyRepository.findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found"));

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Party must be approved to submit a program");
        }

        return party;
    }
}