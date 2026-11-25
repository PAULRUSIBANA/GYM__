package gym.gym_membership_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import gym.gym_membership_system.service.TrainingSessionService;
import gym.gym_membership_system.domain.TrainingSession;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import gym.gym_membership_system.domain.SessionStatus;
@RestController 
@RequestMapping ("/api/training-sessions")
public class TrainingSessionController {
    @Autowired
    private TrainingSessionService trainingSessionService;

    @PostMapping (value ="/save",consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> save (@RequestBody TrainingSession session){
        String result = trainingSessionService.save(session);
        if (result.contains("in the past"))
            return new ResponseEntity<>(result,HttpStatus.BAD_REQUEST);
        if (result.contains("already booked"))
            return new ResponseEntity<>(result,HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping (value = "/{id}", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getbyId(@PathVariable UUID id){
        Object result =trainingSessionService.getById(id);
        if (result instanceof String)
            return new ResponseEntity<>(result,HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping (value = "/all",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TrainingSession>> getAll(){
        return new ResponseEntity<>(trainingSessionService.getAll(), HttpStatus.OK);

    }

    @PutMapping (value="/update/{id}",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> update(@PathVariable UUID id,@RequestBody TrainingSession session){
        String result =trainingSessionService.update(id, session);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @DeleteMapping (value = "/delete/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(@PathVariable UUID id){
        String result = trainingSessionService.delete(id);
        if (result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        if (result.contains("has workout logs"))
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping(value = "/by-status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TrainingSession>> getByStatus(@RequestParam SessionStatus status) {
       return new ResponseEntity<>(trainingSessionService.getByStatus(status), HttpStatus.OK);
    }
 



    @GetMapping(value = "/between", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TrainingSession>> getBetween(@RequestParam String start, @RequestParam String end) {
        return new ResponseEntity<>(trainingSessionService.getBetween(LocalDate.parse(start), LocalDate.parse(end)),HttpStatus.OK);
    }

    @PatchMapping(value = "/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestParam SessionStatus status) {
        String result = trainingSessionService.updateStatus(id, status);
            if (result.contains("does not exist"))
                return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
            if (result.contains("annot change"))
                return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/stats/by-status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Object[]>> statsByStatus() {
        return new ResponseEntity<>(trainingSessionService.countByStatus(), HttpStatus.OK);
    }

    @PatchMapping(value = "/cancel-day", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> cancelDay(@RequestParam UUID trainerId, @RequestParam String date) {
        String result = trainingSessionService.cancelDay(trainerId, LocalDate.parse(date));
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

