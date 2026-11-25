package gym.gym_membership_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gym.gym_membership_system.domain.Trainer;
import org.springframework.web.bind.annotation.PathVariable;

import gym.gym_membership_system.service.TrainerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.UUID;



@RestController 
@RequestMapping ("/api/trainers")
public class TrainerController {
    @Autowired 
    private TrainerService trainerService;

    @PostMapping (value = "/save",consumes = MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> save(@RequestBody Trainer trainer){
        return new ResponseEntity<>(trainerService.save(trainer), HttpStatus.CREATED);
    }

    @GetMapping (value="/all",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Trainer>>getAll(){
        return new ResponseEntity<>(trainerService.getAll(), HttpStatus.OK);
    }

    @GetMapping (value="/{id}",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getById(@PathVariable UUID id){
        Object result = trainerService.getId(id);
        if(result instanceof String)
            return new ResponseEntity<String>((String)result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<Trainer>((Trainer)result, HttpStatus.OK);
    }

    @PutMapping (value="/update/{id}",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> update(@PathVariable UUID id,@RequestBody Trainer trainer){
        String result = trainerService.update(id, trainer);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping (value="/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(@PathVariable UUID id){
        String result = trainerService.delete(id);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping (value="/by-discipline", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Trainer>> getByDisciplineName(@RequestParam String name){
        return new ResponseEntity<>(trainerService.getByDisciplineName(name), HttpStatus.OK);
    }

    @PutMapping (value = "/{trainerId}/disciplines", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addDisciplines(@PathVariable UUID trainerId, @RequestBody List<UUID> disciplineIds){
        String result = trainerService.addDisciplines(trainerId, disciplineIds);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        if(result.contains("already has"))
            return new ResponseEntity<>(result,HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PatchMapping(value = "/{trainerId}/studio", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> moveToStudio(@PathVariable UUID trainerId, @RequestParam int studioNumber) {
        String result = trainerService.moveToStudio(trainerId, studioNumber);
        if (result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        if (result.contains("taken"))
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
