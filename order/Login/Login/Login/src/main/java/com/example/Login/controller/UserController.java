package com.example.Login.controller;


import com.example.Login.data.User;
import com.example.Login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/users") //login/users/login
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/signup")
    public User createUsers(@RequestBody User user)
    {

        return userService.createUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User userReq){
        User user = userService.getUser(userReq.getEmail());

        if(user.getPassword().equals(userReq.getPassword())){
            return user;
        }
        return null;
    }

   /* @GetMapping
    public List<User> findAllUsers()
    {
        return userService.getUser();
    }

    @GetMapping(path = "/{userId}")
    public User findUserById(@PathVariable int userId)
    {
        return userService.getUserById(userId);
    }*/


}
