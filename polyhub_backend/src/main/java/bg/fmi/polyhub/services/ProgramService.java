package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.PoliticalPositionType;
import bg.fmi.polyhub.dto.election.ElectionWithProgramResponse;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.dto.program.CreateProgramRequest;
import bg.fmi.polyhub.dto.program.ProgramDetailsResponse;
import bg.fmi.polyhub.dto.program.ProgramPolicyDetailsResponse;
import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.dto.program.ProgramSuggestion;
import bg.fmi.polyhub.dto.specialist.ProgramForRatingResponse;
import bg.fmi.polyhub.dto.specialist.ProgramRatingRequest;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.PartyStatusType;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.entities.ProgramPolicy;
import bg.fmi.polyhub.entities.ProgramPolicyId;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.ProgramMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.PartyParticipationRepository;
import bg.fmi.polyhub.repositories.PartyRepository;
import bg.fmi.polyhub.repositories.PolicyRepository;
import bg.fmi.polyhub.repositories.ProgramPolicyRepository;
import bg.fmi.polyhub.repositories.ProgramRepository;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.utils.ElectionStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final PartyParticipationRepository partyParticipationRepository;

    public Optional<ProgramSuggestion> getSuggestion(String email) {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        return programRepository.findAllByPartyOrderByCreatedAtDesc(party)
                .stream()
                .findFirst()
                .map(prev -> {
                    List<PolicySummary> policies = programPolicyRepository.findAllByProgram(prev)
                            .stream()
                            .map(pp -> toPolicySummary(pp.getPolicy()))
                            .toList();

                    return new ProgramSuggestion(
                            prev.getTitle(),
                            prev.getContent(),
                            prev.getSelfEconomicAxis(),
                            prev.getSelfSocialAxis(),
                            policies
                    );
                });
    }

    @Transactional
    public ProgramResponse createOrUpdate(Long electionId, CreateProgramRequest request, String email) {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        LocalDate cutoff = election.getElectionDate().minusDays(7);
        if (LocalDate.now().isAfter(cutoff)) {
            throw new RuntimeException("Programs can only be submitted up to 1 week before the election");
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
        if (!partyParticipationRepository.existsByPartyAndElection(party, election)) {
            PartyParticipation pp = new PartyParticipation();
            pp.setParty(party);
            pp.setElection(election);
            partyParticipationRepository.save(pp);
        }

        programPolicyRepository.deleteAllByProgram(saved);

        List<Policy> policies = policyRepository.findAllByIdIn(request.policyIds());
        policies.forEach(policy -> {
            ProgramPolicy programPolicy = new ProgramPolicy();
            programPolicy.setId(new ProgramPolicyId(saved.getId(), policy.getId()));
            programPolicy.setProgram(saved);
            programPolicy.setPolicy(policy);
            programPolicyRepository.save(programPolicy);
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

    public List<ElectionWithProgramResponse> getAllElectionsWithProgramStatus(String email)  {
        User user = getActiveUser(email);
        Party party = getApprovedParty(user);

        return electionRepository.findAllByOrderByElectionDateDesc()
                .stream()
                .map(election -> {
                    Optional<Program> program = programRepository.findByPartyAndElection(party, election);
                    boolean editable = !LocalDate.now().isAfter(election.getElectionDate().minusDays(7));

                    Optional<PartyParticipation> winner = partyParticipationRepository
                            .findTopByElectionOrderByVotePercentageDesc(election);

                    return new ElectionWithProgramResponse(
                            election.getId(),
                            election.getName(),
                            election.getElectionDate(),
                            election.getDescription(),
                            election.getType().getName(),
                            ElectionStatusUtils.getStatus(election),
                            winner.map(w -> w.getParty().getName()).orElse(null),
                            winner.map(PartyParticipation::getVotePercentage).orElse(null),
                            program.map(Program::getId).orElse(null),
                            program.isPresent(),
                            editable
                    );
                })
                .toList();
    }

    public ProgramDetailsResponse getDetails(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        List<ProgramPolicy> rawPolicies = programPolicyRepository.findAllByProgram(program);
        List<ProgramPolicyDetailsResponse> policies = rawPolicies.stream()
                .map(this::toPolicyDetails)
                .toList();

        return programMapper.toDetailsResponse(program, policies);
    }

    public List<ProgramForRatingResponse> getAllPrograms() {
        return programRepository.findAll()
                .stream()
                .filter(p -> {
                    User owner = p.getParty().getCreatedBy();
                    return owner.getDeletedAt() == null && owner.getSuspendedOn() == null;
                })
                .map(this::toRatingResponse)
                .toList();
    }

    public ProgramForRatingResponse getProgram(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        return toRatingResponse(program);
    }

    public ProgramForRatingResponse rateProgram(Long id, ProgramRatingRequest request) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        if (program.getElection().getElectionDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot rate a program for a past election");
        }

        program.setSpecEconomicAxis(request.specEconomicAxis());
        program.setSpecSocialAxis(request.specSocialAxis());

        return toRatingResponse(programRepository.save(program));
    }

    private ProgramPolicyDetailsResponse toPolicyDetails(ProgramPolicy programPolicy) {
        Policy policy = programPolicy.getPolicy();
        PoliticalPositionType positionType = PoliticalPositionType.from(
                policy.getSpecEconomicAxis(),
                policy.getSpecSocialAxis()
        );
        String position = positionType != null ? positionType.name() : null;

        return programMapper.toPolicyDetails(programPolicy)
                .toBuilder()
                .politicalPosition(position)
                .build();
    }

    private ProgramForRatingResponse toRatingResponse(Program program) {
        List<PolicySummary> policies = programPolicyRepository.findAllByProgram(program)
                .stream()
                .map(programPolicy -> {
                    Policy policy = programPolicy.getPolicy();

                    PoliticalPositionType position = PoliticalPositionType.from(
                            policy.getSpecEconomicAxis(),
                            policy.getSpecSocialAxis()
                    );

                    return new PolicySummary(
                            policy.getId(),
                            policy.getName(),
                            policy.getSlug(),
                            position != null ? position.name() : null,
                            policy.getSpecEconomicAxis(),
                            policy.getSpecSocialAxis()
                    );
                })
                .toList();

        return programMapper.toRatingResponseBase(program)
                .toBuilder()
                .policies(policies)
                .rated(program.getSpecEconomicAxis() != null && program.getSpecSocialAxis() != null)
                .electionPassed(program.getElection().getElectionDate().isBefore(LocalDate.now()))
                .build();
    }

    private Party getApprovedParty(User user) {
        Party party = partyRepository.findByCreatedByAndDeletedAtIsNull(user)
                .orElseThrow(() -> new RuntimeException("No party found"));

        if (party.getStatus().getName() != PartyStatusType.APPROVED) {
            throw new RuntimeException("Party must be approved to submit a program");
        }

        return party;
    }

    private User getActiveUser(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private PolicySummary toPolicySummary(Policy policy) {
        PoliticalPositionType position = PoliticalPositionType.from(
                policy.getSpecEconomicAxis(),
                policy.getSpecSocialAxis()
        );
        return new PolicySummary(
                policy.getId(),
                policy.getName(),
                policy.getSlug(),
                position != null ? position.name() : null,
                policy.getSpecEconomicAxis(),
                policy.getSpecSocialAxis()
        );
    }
}