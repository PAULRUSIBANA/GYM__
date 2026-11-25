package gym.gym_membership_system.repository;

import gym.gym_membership_system.domain.TrainingSession;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Modifying;

import gym.gym_membership_system.domain.SessionStatus;
import gym.gym_membership_system.domain.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {

    List<TrainingSession> findByStatusOrderBySessionDateAsc(SessionStatus status);


    List<TrainingSession> findBySessionDateBetweenOrderBySessionDateAsc(LocalDate start, LocalDate end);

    boolean existsByTrainerIdAndSessionDateAndStatusNot(UUID trainerId, LocalDate date, SessionStatus status);

    @Query("SELECT DISTINCT ts.member FROM TrainingSession ts WHERE ts.trainer.id = :trainerId")
    List<Member> findMembersByTrainerId(@Param("trainerId") UUID trainerId);

 
    @Query("SELECT ts.status, COUNT(ts) FROM TrainingSession ts GROUP BY ts.status")
    List<Object[]> countByStatus();

    @Modifying
    @Transactional
    @Query("UPDATE TrainingSession ts SET ts.status = :cancelled WHERE ts.trainer.id = :trainerId AND ts.sessionDate = :date AND ts.status <> :finished")
    int cancelDay(@Param("trainerId") UUID trainerId, @Param("date") LocalDate date, @Param("cancelled") SessionStatus cancelled, @Param("finished") SessionStatus finished);

    boolean existsByTrainerIdAndSessionDateAndStatusNotAndIdNot(UUID trainerId, LocalDate date, SessionStatus status, UUID id);
}
