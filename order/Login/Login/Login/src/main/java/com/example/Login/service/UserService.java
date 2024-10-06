package com.example.Login.service;

import com.example.Login.Exceptions.UserException;
import com.example.Login.data.User;
import com.example.Login.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user)
    {
        if(getUser(user.getEmail()) == null )
            return userRepository.save(user);
        else
            throw new UserException("User Already defined");
    }

    public List<User> getUser()
    {
        return userRepository.findAll();
    }

    public User getUserById(int userId)
    {
        Optional<User> user = userRepository.findById(userId);
        return user.orElse(null);
    }

    public User getUser(String email)
    {
        return userRepository.findByEmail(email);
    }

}
