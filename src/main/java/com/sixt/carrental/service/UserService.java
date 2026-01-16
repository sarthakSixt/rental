package com.sixt.carrental.service;

import com.sixt.carrental.entity.User;
import com.sixt.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import  java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class UserService {
    private final UserRepository userRepository;

    //Registering the new user
    public User registerUser(User user){
        // checking if email does already exists
        if(userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException(("The email is alreasy registered: " + user.getEmail()));
        }

        return userRepository.save(user);
    }

    //Find user by Email (for logIn)
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    // find user by ID
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }
    //Get all users (admin function if required)
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // Udate user details
    public User updateUser(User user){
        if(!userRepository.existsById(user.getId())){
            throw new RuntimeException("User not found with the given ID: " + user.getId());
        }
        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Long id){
        if(!userRepository.existsById(id)){
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}