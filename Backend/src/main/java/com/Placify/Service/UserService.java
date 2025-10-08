package com.Placify.Service;

import com.Placify.Entity.User;
import com.Placify.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public List<User> getAll() {
        return userRepository.findAll();
    }

    public void save(User myUser) {
        userRepository.save(myUser);
    }
}
