package gym.gym_membership_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gym.gym_membership_system.repository.MemberRepository;
import gym.gym_membership_system.repository.TrainerRepository;
import gym.gym_membership_system.domain.TrainingSession;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import gym.gym_membership_system.repository.TrainingSessionRepository;
import gym.gym_membership_system.repository.WorkoutLogRepository;
import jakarta.transaction.Transactional;
import gym.gym_membership_system.domain.SessionStatus;

@Service
public class TrainingSessionService {
    @Autowired 
    private TrainingSessionRepository trainingSessionRepository;

    @Autowired 
    private MemberRepository memberRepository;

    @Autowired 
    private TrainerRepository trainerRepository;

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

    public String save(TrainingSession session) {
        if (session.getSessionDate() != null &&
                session.getSessionDate().isBefore(LocalDate.now()))
            return "Training session date cannot be in the past";

        if (session.getTrainer() == null || session.getTrainer().getId() == null)
            return "Trainer is required";
        if (session.getMember() == null || session.getMember().getId() == null)
            return "Member is required";

        Optional<gym.gym_membership_system.domain.Trainer> trainerOpt = trainerRepository.findById(session.getTrainer().getId());
        if (trainerOpt.isEmpty()) return "The trainer with that id does not exist";

        Optional<gym.gym_membership_system.domain.Member> memberOpt = memberRepository.findById(session.getMember().getId());
        if (memberOpt.isEmpty()) return "The member with that id does not exist";

        if (trainingSessionRepository.existsByTrainerIdAndSessionDateAndStatusNot(
                trainerOpt.get().getId(), session.getSessionDate(), SessionStatus.CANCELLED))
            return "Trainer is already booked on that date";

        session.setTrainer(trainerOpt.get());
        session.setMember(memberOpt.get());
        session.setStatus(SessionStatus.BOOKED);
        trainingSessionRepository.save(session);
        return "Training session saved successfully";
    }

    public List<TrainingSession> getAll(){
        return trainingSessionRepository.findAll();
    }

    

    public Object getById(UUID id){
        Optional<TrainingSession> ts = trainingSessionRepository.findById(id);
        if (ts.isEmpty()) return "the training session with that id doesnt exist";
        return ts.get();
     
       
    }

    public String update(UUID id, TrainingSession updated){
        Optional<TrainingSession> existing = trainingSessionRepository.findById(id);
        if (existing.isEmpty()) return "the training session with that id doesnt exist";
        TrainingSession ts = existing.get();
        if(updated.getSessionDate() != null) ts.setSessionDate(updated.getSessionDate());
        if(updated.getGoal() != null) ts.setGoal(updated.getGoal());
        trainingSessionRepository.save(ts);
        return "training session updated successfully";

    }

    public String delete(UUID id){
        if (!trainingSessionRepository.existsById(id))
            return "the training session with that id doesnt exist";
        if (workoutLogRepository.existsByTrainingSessionId(id))
            return "That training session has workout logs, delete them first";
        trainingSessionRepository.deleteById(id);
        return "training session deleted successfully";
    }

    public Object getByStatus(String status){
        try {
            SessionStatus s = SessionStatus.valueOf(status.toUpperCase());
            return trainingSessionRepository.findByStatusOrderBySessionDateAsc(s);
        } catch (IllegalArgumentException e) {
            return "Invalid status: " + status;
        }
    }

    public List<TrainingSession> getBetween(LocalDate start,LocalDate end){
        return trainingSessionRepository.findBySessionDateBetweenOrderBySessionDateAsc(start, end);
    }

    public String updateStatus(UUID id,SessionStatus newStatus){
        Optional<TrainingSession> existing=trainingSessionRepository.findById(id);
        if (existing.isEmpty()) return "the training session with that id doesnt exist";
        TrainingSession ts = existing.get();
        SessionStatus current = ts.getStatus();

        boolean allowed =false;
        if (current == SessionStatus.BOOKED &&
            (newStatus == SessionStatus.CHECKED_IN || newStatus == SessionStatus.CANCELLED))
            allowed = true;

        if (current == SessionStatus.CHECKED_IN &&
            (newStatus == SessionStatus.FINISHED || newStatus == SessionStatus.CANCELLED))
            allowed = true;


        if (!allowed)
            return "cannot change status from " + current.name() + " to " + newStatus.name();
        ts.setStatus(newStatus);
        trainingSessionRepository.save(ts);
        return "training session status updated successfully";

    }

    public List<Object[]> countByStatus(){
        return trainingSessionRepository.countByStatus();
    }

    public List<TrainingSession> getByStatus(SessionStatus status) {
    return trainingSessionRepository.findByStatusOrderBySessionDateAsc(status);
}


    @Transactional 
    public String cancelDay (UUID trainerId,LocalDate date){
        int count = trainingSessionRepository.cancelDay(trainerId, date, SessionStatus.CANCELLED, SessionStatus.FINISHED);
        return count + "training session cancelled";
    }
}
