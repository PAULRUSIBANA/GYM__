package gym.gym_membership_system.repository;

import gym.gym_membership_system.domain.Member;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, UUID>{
    List<Member> findByLastNameIgnoreCaseOrderByFirstNameAsc(String lastName);
    Optional<Member> findByMemberNumber(String memberNumber);
    boolean existsByMemberNumber(String memberNumber);
}
