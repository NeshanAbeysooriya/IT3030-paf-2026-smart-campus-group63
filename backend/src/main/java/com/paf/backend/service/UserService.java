package com.paf.backend.service;



import com.paf.backend.model.Role;
import com.paf.backend.model.User;
import com.paf.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//Controller → Service → Repository → DB flow

@Service
public class UserService {

    private final UserRepository userRepository; // database access
    private final PasswordEncoder passwordEncoder; // password encrypt

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) { // constructor
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Save user into DB  from Google login
    public User saveGoogleUser(String name, String email, String image) {

        User user = userRepository.findByEmail(email).orElse(null); // email ekt user find karanva, user thiyenava nam return karanva, nathnam null return karanva

        if (user == null) { // user  nullnm new user create karanva, user thiyenava nam update karanva
            user = new User();
            user.setEmail(email);
            user.setRole(Role.USER);
            user.setProvider("GOOGLE");
            user.setPassword(null); // important for google login
        }

        user.setName(name); // update name
        user.setProvider("GOOGLE"); // ALWAYS set

        if (image != null && !image.isEmpty()) { // check image
            user.setImage(image); // if image exit use it
        } else {
            user.setImage("/user.png"); // else use default image
        }

        return userRepository.save(user); // save or update user in to DB
    }

    // Change role (ADMIN only)
    public User updateRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow(); // id ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva
        user.setRole(role); // user role update karanva
        return userRepository.save(user); // save updated user in to DB
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email) // email ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }

    // UPDATE USER PROFILE
    public User updateUser(User updatedUser) {

        User user = userRepository.findByEmail(updatedUser.getEmail()) // email ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getName() != null) { // name nullnm update karanva, name thiyenava nam update karanva, nathnam skip karanva
            user.setName(updatedUser.getName());
        }

        if (updatedUser.getImage() != null) { // image nullnm update karanva, image thiyenava nam update karanva, nathnam skip karanva
            user.setImage(updatedUser.getImage());
        }

        return userRepository.save(user); // save to DB
    }

    public void changePassword(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(); // email ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva

        user.setPassword(passwordEncoder.encode(password)); // ✅ ENCRYPTED - password encrypt karanva, user object ekt set karanva

        userRepository.save(user); // save updated user in to DB
    }

    public List<User> getAllUsers() { // get all user list, frontend ekata user list display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
        return userRepository.findAll();
    }

    public User toggleUser(Long id) { 
        User user = userRepository.findById(id)// id ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive()); // user active/inactive switch karanva, active nam inactive karanva, inactive nam active karanva

        return userRepository.save(user);
    }

    public String forgotPassword(String email) {

        System.out.println("EMAIL RECEIVED: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("USER FOUND: " + user.getEmail());

        if (!user.isActive()) {// user blocknm reject karanva, user data thiyenava nam check karanva, user blocknm bad request error return karanva, user is blocked message return karanva, etc.
            throw new RuntimeException("User is blocked");
        }

        return "Reset link sent";
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

}