package gym.gym_membership_system.service;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gym.gym_membership_system.repository.DisciplineRepository;
import gym.gym_membership_system.repository.StudioRepository;
import gym.gym_membership_system.repository.TrainerRepository;
import gym.gym_membership_system.domain.Discipline;
import gym.gym_membership_system.domain.Trainer;
import gym.gym_membership_system.domain.Studio;

@Service 
public class TrainerService {
    @Autowired 
    private TrainerRepository trainerRepository;

    @Autowired 
    private DisciplineRepository disciplineRepository;

    @Autowired 
    private StudioRepository studioRepository;  

    public String save(Trainer trainer){
        trainerRepository.save(trainer);
        return "Trainer saved successfully";
    }

    public List<Trainer>getAll(){
        return trainerRepository.findAll();
    }

    public Object getId(UUID id){
        Optional<Trainer> t=trainerRepository.findById(id);
        if(t.isEmpty()) return "the trainer with that id does not exist";
        return t.get();

    }

    public String update(UUID id, Trainer updated) {
        Optional<Trainer> existing = trainerRepository.findById(id);
        if (existing.isEmpty()) return "The trainer with that id does not exist";
        Trainer t = existing.get();
        if (updated.getFirstName() != null) t.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) t.setLastName(updated.getLastName());
        if (updated.getEmail() != null) t.setEmail(updated.getEmail());
        trainerRepository.save(t);
        return "Trainer updated successfully";
    }

    public String delete(UUID id){
        if (!trainerRepository.existsById(id))
            return "the trainer with that id doesnt exist";
        trainerRepository.deleteById(id);
        return "trainer deleted successfully";
    }

    public List<Trainer> getByDisciplineName(String name){
        return trainerRepository.findByDisciplineName(name);
    }

    public String addDisciplines(UUID trainerId, List<UUID> disciplineIds){
        Optional<Trainer> tOpt = trainerRepository.findById(trainerId);
        if (tOpt.isEmpty()) return "the trainer with that id does not exist";
        Trainer trainer = tOpt.get();
        for (UUID disciplineId : disciplineIds) {
            Optional<Discipline> dOpt = disciplineRepository.findById(disciplineId);
            if (dOpt.isEmpty()) return "the discipline with id " + disciplineId + " does not exist";
            Discipline discipline = dOpt.get();
            if (trainer.getDisciplines().contains(discipline))
                return "the trainer already has discipline " + discipline.getName();
            trainer.getDisciplines().add(discipline);
        }
        trainerRepository.save(trainer);
        return "disciplines added to trainer successfully";
    }

    public String moveToStudio(UUID trainerId,int studioNumber){
        Optional<Trainer> tOpt = trainerRepository.findById(trainerId);
        if (tOpt.isEmpty()) return "the trainer with that id does not exist";
        Optional<Studio> sOpt = studioRepository.findByStudioNumber(studioNumber);
        if (sOpt.isEmpty()) return "the studio with that number does not exist";
        if(trainerRepository.existsByStudio(sOpt.get()))
            return "that studio is taken by another trainer";
        Trainer trainer = tOpt.get();
        trainer.setStudio(sOpt.get());
        studioRepository.save(sOpt.get());
        return"studio changed successfully";

        
    }
}
