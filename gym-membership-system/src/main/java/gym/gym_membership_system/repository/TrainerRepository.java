package gym.gym_membership_system.repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import gym.gym_membership_system.domain.Studio;
import gym.gym_membership_system.domain.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, UUID> {
    Optional<Trainer> findByFirstNameAndLastName(String firstName, String lastName);
    boolean existsByStudio(Studio studio);

    @Query("SELECT t FROM Trainer t JOIN t.disciplines d WHERE LOWER(d.name) = LOWER(:name)")
    List<Trainer> findByDisciplineName(@Param("name") String name);
}
