package gym.gym_membership_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gym.gym_membership_system.repository.MemberRepository;
import gym.gym_membership_system.repository.TrainerRepository;
import gym.gym_membership_system.domain.Member;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import gym.gym_membership_system.repository.TrainingSessionRepository;
import gym.gym_membership_system.domain.TrainingSession;
@Service 
public class MemberService {
    
    @Autowired
    MemberRepository memberRepository;

    public String save(Member member){
        if (member.getMemberNumber() != null && memberRepository.existsByMemberNumber(member.getMemberNumber()))
            return "A member with that member number already exists";
        memberRepository.save(member);
        return"Member saved successfully";
    }

    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    public Object getById(UUID id) {
        Optional<Member> m = memberRepository.findById(id);
        if (m.isEmpty()) return "The member with that id does not exist";
        return m.get();
    }

     public String update(UUID id, Member updated) {
        Optional<Member> existing = memberRepository.findById(id);
        if (existing.isEmpty()) return "The member with that id does not exist";
        Member m = existing.get();
        if (updated.getFirstName() != null) m.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) m.setLastName(updated.getLastName());
        if (updated.getEmail() != null) m.setEmail(updated.getEmail());
        if (updated.getPhone() != null) m.setPhone(updated.getPhone());
        memberRepository.save(m);
        return "Member updated successfully";
    }

    public String delete (UUID id ){
        if (!memberRepository.existsById(id))
            return "The member with that id does not exist";
        memberRepository.deleteById(id);
        return "Member deleted successfully";

    }

    public List<Member> getByLastName(String lastName) {
        return memberRepository.findByLastNameIgnoreCaseOrderByFirstNameAsc(lastName);
    }

    public Object getMembersOfTrainer(UUID trainerId){
        if (!trainerRepository.existsById(trainerId)) return "The trainer with that id does not exist";
        return trainingSessionRepository.findMembersByTrainerId(trainerId);
    }

    @Autowired 
    private TrainingSessionRepository trainingSessionRepository;
    @Autowired 
    private TrainerRepository trainerRepository;

}
