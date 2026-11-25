package gym.gym_membership_system.repository;

import gym.gym_membership_system.domain.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, UUID> {

    boolean existsByTrainingSessionId(UUID trainingSessionId);

    @Query("SELECT w FROM WorkoutLog w WHERE w.trainingSession.member.memberNumber = :memberNumber ORDER BY w.loggedDate DESC")
    List<WorkoutLog> findByMemberNumber(@Param("memberNumber") String memberNumber);
}
