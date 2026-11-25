package gym.gym_membership_system.controller;

import gym.gym_membership_system.domain.WorkoutLog;
import gym.gym_membership_system.service.WorkoutLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workout-logs")
public class WorkoutLogController {

    @Autowired
    private WorkoutLogService workoutLogService;

    @PostMapping(value = "/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> save(@RequestParam UUID trainingSessionId, @RequestBody WorkoutLog workoutLog) {
        String result = workoutLogService.save(trainingSessionId, workoutLog);
        if (result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        if (result.contains("only for FINISHED"))
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping(value = "/member/{memberNumber}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkoutLog>> getByMember(@PathVariable String memberNumber) {
        return new ResponseEntity<>(workoutLogService.getByMember(memberNumber), HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        String result = workoutLogService.delete(id);
        if (result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
