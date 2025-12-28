package com.univibe.backend.web;

import com.univibe.backend.dto.PasswordChangeRequest;
import com.univibe.backend.dto.UserDTO;
import com.univibe.backend.model.User;
import com.univibe.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/public/create-user")
    public UserDTO createUser(@RequestBody User user) {
        User createdUser = userService.create(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );

        UserDTO createdUserDTO = new UserDTO();
        createdUserDTO.setId(createdUser.getId());
        createdUserDTO.setEmail(createdUser.getEmail());
        createdUserDTO.setFirstName(createdUser.getFirstName());
        createdUserDTO.setLastName(createdUser.getLastName());
        createdUserDTO.setRole(createdUser.getRole());
        createdUserDTO.setUsername(createdUser.getUsername());
        return createdUserDTO;
    }

    @PostMapping("/update-user")
    public UserDTO updateUser(@RequestBody UserDTO userDTO, @AuthenticationPrincipal User currentUser) {
        if (currentUser == null || !Objects.equals(currentUser.getId(), userDTO.getId())) {
            return null;
        }
        User updatedUser = userService.update(
                userDTO.getId(),
                userDTO.getUsername(),
                userDTO.getEmail(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getRole()
        );

        UserDTO updatedUserDTO = new UserDTO();
        updatedUserDTO.setId(updatedUser.getId());
        updatedUserDTO.setEmail(updatedUser.getEmail());
        updatedUserDTO.setFirstName(updatedUser.getFirstName());
        updatedUserDTO.setLastName(updatedUser.getLastName());
        updatedUserDTO.setRole(updatedUser.getRole());
        updatedUserDTO.setUsername(updatedUser.getUsername());
        return updatedUserDTO;
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody PasswordChangeRequest pcr, @AuthenticationPrincipal User currentUser) {
        if (currentUser == null || !Objects.equals(currentUser.getId(), pcr.getId())) {
            return "User not authorized";
        }
        String result = "";
       try {
           result = userService.updatePassword(pcr.getId(), pcr.getOldPassword(), pcr.getNewPassword());
       }
       catch (Exception e) {
           return e.getMessage();
       }
       return result;
    }
}
