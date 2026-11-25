package gym.gym_membership_system.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gym.gym_membership_system.repository.StudioRepository;
import gym.gym_membership_system.domain.Studio;

@Service 
public class StudioService {
    @Autowired 
    private  StudioRepository studioRepository;

    public String save (Studio studio){
        if (studioRepository.existsByStudioNumber(studio.getStudioNumber()))
            return "A studio with that number already exists";
        studioRepository.save(studio);
        return "Studio SAved successfully";
    }

    public List<Studio> getAll(){
        return studioRepository.findAll();
    }

    public Object getById(UUID id){
        Optional<Studio> s = studioRepository.findById(id);
        if (s.isEmpty()) return "The studio with id does not exist";
         return s.get();

    }

    public String update(UUID id, Studio updated) {
        Optional<Studio> existing = studioRepository.findById(id);
        if (existing.isEmpty()) return "The studio with that id does not exist";
        Studio s = existing.get();
        if (updated.getStudioNumber() != 0 && updated.getStudioNumber() != s.getStudioNumber()
                && studioRepository.existsByStudioNumber(updated.getStudioNumber()))
            return "A studio with that number already exists";
        if (updated.getName() != null) s.setName(updated.getName());
        if (updated.getStudioNumber() != 0) s.setStudioNumber(updated.getStudioNumber());
        studioRepository.save(s);
        return "Studio updated successfully";
    }

    public String delete(UUID id) {
        if (!studioRepository.existsById(id))
            return "The studio with that id does not exist";
        studioRepository.deleteById(id);
        return "Studio deleted successfully";
    }

    public List<Studio> getFreeStudio(){
        return studioRepository.findFreeStudios();
    }

}
