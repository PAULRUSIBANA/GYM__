package gym.gym_membership_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;
import java.util.Optional;
import gym.gym_membership_system.domain.Discipline;



@Repository
public interface DisciplineRepository extends JpaRepository<Discipline, UUID> {
    Optional<Discipline> findByName(String name);

    @Query("SELECT d FROM Discipline d WHERE d.trainers IS EMPTY")
List<Discipline> findUnused();

}
