package gym.gym_membership_system.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import gym.gym_membership_system.domain.Studio;
import gym.gym_membership_system.service.StudioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.UUID;
import java.util.List;



@RestController 
@RequestMapping("/api/studios")
public class StudioController {
    @Autowired 
    private StudioService studioService;

    @PostMapping (value="/save", consumes=MediaType.APPLICATION_JSON_VALUE, produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> save(@RequestBody Studio studio){
        String result = studioService.save(studio);
        if (result.contains("already exists"))
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping(value="/all",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Studio>> getAll(){
        return new ResponseEntity<>(studioService.getAll(), HttpStatus.OK);
    }

    @GetMapping(value="/{id}",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getById(@PathVariable UUID id){
        Object result= studioService.getById(id);
        if(result instanceof String)
            return new ResponseEntity<>((String)result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping(value= "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> update(@PathVariable UUID id,@RequestBody Studio studio){
        String result = studioService.update(id, studio);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        if(result.contains("already exists"))
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping(value="/delete/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(@PathVariable UUID id ){
        String result = studioService.delete(id);
        if(result.contains("does not exist"))
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping (value="/free",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Studio>> getFreeStudio(){
        return new ResponseEntity<>(studioService.getFreeStudio(), HttpStatus.OK);
    }

    
    
}
