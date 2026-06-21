package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.specialist.CreatePolicyRequest;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.mappers.PolicyMapper;
import bg.fmi.polyhub.repositories.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {
    private final PolicyRepository policyRepository;
    private final PolicyMapper policyMapper;

    public List<PolicySummary> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(policyMapper::toPolicySummary)
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

    public void deletePolicyById(Long id) {
        if (policyRepository.existsById(id)) {
            throw new RuntimeException("Policy with this id does not exist.");
        }
    }

    public static boolean isValid(Double economic, Double social) {
        return economic != null
                && social != null
                && economic >= -1 && economic <= 1
                && social >= -1 && social <= 1;
    }
}
