package gym.gym_membership_system.service;

import gym.gym_membership_system.domain.SessionStatus;
import gym.gym_membership_system.domain.TrainingSession;
import gym.gym_membership_system.domain.WorkoutLog;
import gym.gym_membership_system.repository.TrainingSessionRepository;
import gym.gym_membership_system.repository.WorkoutLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutLogService {

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

    @Autowired
    private TrainingSessionRepository trainingSessionRepository;

    public String save(UUID trainingSessionId, WorkoutLog workoutLog) {
        Optional<TrainingSession> tsOpt = trainingSessionRepository.findById(trainingSessionId);
        if (tsOpt.isEmpty()) return "The training session with that id does not exist";
        TrainingSession session = tsOpt.get();
        if (session.getStatus() != SessionStatus.FINISHED)
            return "Workout logs are only for FINISHED training sessions";
        workoutLog.setLoggedDate(LocalDate.now());
        workoutLog.setTrainingSession(session);
        workoutLogRepository.save(workoutLog);
        return "Workout log saved successfully";
    }

    public List<WorkoutLog> getByMember(String memberNumber) {
        return workoutLogRepository.findByMemberNumber(memberNumber);
    }

    public String delete(UUID id) {
        if (!workoutLogRepository.existsById(id))
            return "The workout log with that id does not exist";
        workoutLogRepository.deleteById(id);
        return "Workout log deleted successfully";
    }
}
