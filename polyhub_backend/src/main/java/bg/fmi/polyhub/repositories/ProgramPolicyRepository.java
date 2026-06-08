package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.ProgramPolicy;
import bg.fmi.polyhub.entities.ProgramPolicyId;
import bg.fmi.polyhub.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramPolicyRepository extends JpaRepository<ProgramPolicy, ProgramPolicyId> {
    List<ProgramPolicy> findAllByProgram(Program program);
    void deleteAllByProgram(Program program);
}