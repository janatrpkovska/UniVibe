package com.univibe.backend.service;

import com.univibe.backend.model.Role;
import com.univibe.backend.model.User;

import java.util.List;

public interface UserService {
    User findById(long id);
    User findByUsername(String username);
    User create(String username, String password, String email, String firstName, String lastName, Role role);
    User update(Long id, String username, String email, String firstName, String lastName, Role role);
    User delete(Long id);
    String updatePassword(Long id, String oldPassword, String newPassword);
    List<User> findAll();
}
