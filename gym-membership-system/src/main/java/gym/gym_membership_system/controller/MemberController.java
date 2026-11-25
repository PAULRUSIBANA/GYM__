package gym.gym_membership_system.controller;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import gym.gym_membership_system.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.MediaType;
import gym.gym_membership_system.domain.Member;
import  java.util.UUID;


@RestController 
@RequestMapping("/api/members")
public class MemberController {
    @Autowired 
    private MemberService memberService;

    @PostMapping (value ="/save",consumes = MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> save(@RequestBody Member member){
        String result = memberService.save(member);
        if (result.contains("already exists"))
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping (value = "/all",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Member>> getAll(){
        return new ResponseEntity<>(memberService.getAll(), HttpStatus.OK);
    }
    
    @GetMapping (value = "/{id}", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>getById(@PathVariable UUID id){
        Object result = memberService.getById(id);
        if(result instanceof String)
            return new ResponseEntity<String>((String)result,HttpStatus.NOT_FOUND);
        return new ResponseEntity<Member>((Member)result, HttpStatus.OK);

    }

    @PutMapping (value="/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Member member){
        String result = memberService.update(id, member);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping (value = "/delete/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(@PathVariable UUID id){
        String result = memberService.delete(id);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/by-last-name", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Member>> getByLastName(@RequestParam String lastName) {
        return new ResponseEntity<>(memberService.getByLastName(lastName), HttpStatus.OK);
    }

    @GetMapping (value = "/of-trainer/{trainerId}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>getMembersOfTrainer(@PathVariable UUID trainerId){
        Object result = memberService.getMembersOfTrainer(trainerId);
        if(result instanceof String)
            return new ResponseEntity<String>((String)result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<List<Member>>((List<Member>)result, HttpStatus.OK);
    }
}
