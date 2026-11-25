package gym.gym_membership_system.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gym.gym_membership_system.repository.DisciplineRepository;
import gym.gym_membership_system.domain.Discipline;
import java.util.Optional;

@Service 
public class DisciplineService {
    
    @Autowired 
    private DisciplineRepository disciplineRepository;

    public String save (Discipline discipline){
        disciplineRepository.save(discipline);
        return "Discipline saved successfully";
    }

    public List<Discipline> getAll() {
        return disciplineRepository.findAll();
    }

    public Object getById(UUID id) {
        Optional<Discipline> d = disciplineRepository.findById(id);
        if (d.isEmpty()) return "The discipline with that id does not exist ";
        return d.get();
    }

      public String update(UUID id, Discipline updated) {
        Optional<Discipline> existing = disciplineRepository.findById(id);
        if (existing.isEmpty()) return "The discipline with that id does not exist";
        Discipline d = existing.get();
        if (updated.getName() != null) d.setName(updated.getName());
        disciplineRepository.save(d);
        return "Discipline updated successfully";
    }

    public String delete(UUID id) {
        if (!disciplineRepository.existsById(id))
            return "The discipline with that id does not exist";
        disciplineRepository.deleteById(id);
        return "Discipline deleted successfully";
    }

    public List<Discipline> getUnused(){
        return disciplineRepository.findUnused();
    }


}
