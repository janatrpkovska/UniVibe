package com.univibe.backend.service.impl;

import com.univibe.backend.model.Role;
import com.univibe.backend.model.User;
import com.univibe.backend.repository.UserJpaRepository;
import com.univibe.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserJpaRepository userJpaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User findById(long id) {
        return this.userJpaRepository.findById(id).orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        return this.userJpaRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User create(String username, String password, String email, String firstName, String lastName, Role role,  String telephone, String city) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setTelephone(telephone);
        user.setCity(city);
        return userJpaRepository.save(user);
    }

    @Override
    public User update(Long id, String username, String email, String firstName, String lastName, Role role, String  telephone, String city) {
        User user = this.findById(id);

        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setTelephone(telephone);
        user.setCity(city);

        return userJpaRepository.save(user);
    }

    @Override
    public User delete(Long id) {
        User toDelete = this.findById(id);
        userJpaRepository.delete(toDelete);

        return toDelete;
    }

    @Override
    public String updatePassword(Long id, String oldPassword, String newPassword) {
        User user = this.findById(id);
        String result = "password dont match";
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            result = "password matches";
        }
        userJpaRepository.save(user);

        return result;
    }

    @Override
    public List<User> findAll() {
        return userJpaRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userJpaRepository.findByUsername(username);

        if(user.isEmpty()) {
            throw new UsernameNotFoundException("User: " + username + "not found");
        }
        User userDetails = user.get();
        return new org.springframework.security.core.userdetails.User(userDetails.getUsername(), userDetails.getPassword(), List.of(new SimpleGrantedAuthority(userDetails.getRole().name())));
    }
}
