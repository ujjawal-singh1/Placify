package com.Placify.Controller;

import com.Placify.Entity.User;
import com.Placify.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll(){
        return userService.getAll();
    }

    @PostMapping
    public boolean createEntry(@RequestBody User myUser){
        userService.save(myUser);
        return true;
    }




}
