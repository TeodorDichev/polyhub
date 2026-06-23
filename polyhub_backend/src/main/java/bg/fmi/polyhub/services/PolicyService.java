package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.PoliticalPositionType;
import bg.fmi.polyhub.dto.specialist.CreatePolicyRequest;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.mappers.PolicyMapper;
import bg.fmi.polyhub.repositories.PolicyRepository;
import bg.fmi.polyhub.repositories.ProgramPolicyRepository;
import bg.fmi.polyhub.repositories.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {
    private final PolicyRepository policyRepository;
    private final PolicyMapper policyMapper;
    private final ProgramRepository programRepository;
    private final ProgramPolicyRepository programPolicyRepository;

    public List<PolicySummary> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(policyMapper::toPolicySummary)
                .toList();
    }

    public List<PolicySummary> getProgramPolicies(Long programId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        return programPolicyRepository.findAllByProgram(program)
                .stream()
                .map(pp -> toPolicySummary(pp.getPolicy()))
                .toList();
    }

    public PolicySummary createNewPolicy(CreatePolicyRequest newPolicy) {
        if (policyRepository.existsByNameOrSlug(newPolicy.name(), newPolicy.slug())) {
            throw new RuntimeException("Policy with this name already exists.");
        }

        if (!isValid(newPolicy.specSocialAxis(), newPolicy.specEconomicAxis())) {
            throw new RuntimeException("Invalid axis params");
        }

        Policy saved = policyRepository.save(policyMapper.toEntity(newPolicy));

        return policyMapper.toPolicySummary(saved);
    }

    public PolicySummary updatePolicy(Long id, CreatePolicyRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        if (!isValid(request.specSocialAxis(), request.specEconomicAxis())) {
            throw new RuntimeException("Invalid axis params");
        }

        policy.setName(request.name());
        policy.setSlug(request.slug());
        policy.setSpecEconomicAxis(request.specEconomicAxis());
        policy.setSpecSocialAxis(request.specSocialAxis());

        return policyMapper.toPolicySummary(policyRepository.save(policy));
    }

    public void deletePolicyById(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new RuntimeException("Policy with this id does not exist.");
        }
        policyRepository.deleteById(id);
    }

    public static boolean isValid(Double economic, Double social) {
        return economic != null
                && social != null
                && economic >= -1 && economic <= 1
                && social >= -1 && social <= 1;
    }

    public List<PolicySummary> search(String query) {
        return policyRepository
                .findTop10ByNameContainingIgnoreCaseOrderByNameAsc(query)
                .stream()
                .map(policyMapper::toPolicySummary)
                .toList();
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
                position != null ? position.name() : null
        );
    }
}
