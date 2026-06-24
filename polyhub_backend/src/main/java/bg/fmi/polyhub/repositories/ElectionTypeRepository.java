package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.ElectionType;
import bg.fmi.polyhub.entities.ElectionTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElectionTypeRepository extends JpaRepository<ElectionType, Long> {
    Optional<ElectionType> findByName(ElectionTypeEnum name);
}