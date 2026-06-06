package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.ElectionType;
import bg.fmi.polyhub.mappers.ElectionMapper;
import bg.fmi.polyhub.repositories.ElectionRepository;
import bg.fmi.polyhub.repositories.ElectionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final ElectionTypeRepository electionTypeRepository;
    private final ElectionMapper electionMapper;

    public ElectionResponse create(CreateElectionRequest request) {
        ElectionType type = electionTypeRepository
                .findByName(request.type())
                .orElseThrow(() -> new RuntimeException("Election type not found"));

        Election election = electionMapper.toEntity(request);
        election.setType(type);

        return electionMapper.toResponse(electionRepository.save(election));
    }

    public List<ElectionResponse> getAll() {
        return electionRepository.findAllByOrderByElectionDateDesc()
                .stream()
                .map(electionMapper::toResponse)
                .toList();
    }

    public ElectionResponse update(Long id, CreateElectionRequest request) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        ElectionType type = electionTypeRepository
                .findByName(request.type())
                .orElseThrow(() -> new RuntimeException("Election type not found"));

        election.setName(request.name());
        election.setElectionDate(request.electionDate());
        election.setDescription(request.description());
        election.setType(type);

        return electionMapper.toResponse(electionRepository.save(election));
    }

    public void delete(Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));
        electionRepository.delete(election);
    }
}