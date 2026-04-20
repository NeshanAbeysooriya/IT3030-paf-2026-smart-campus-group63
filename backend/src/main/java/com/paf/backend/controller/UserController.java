package com.paf.backend.controller;

import com.paf.backend.dto.RegisterRequest;
import com.paf.backend.model.Role;
import com.paf.backend.model.User;
import com.paf.backend.repository.UserRepository;
import com.paf.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController // REST API controller define karanva, JSON response return karanva
@RequestMapping("/api/users") // base URL path define karanva, onam path ekt request handle karanva
public class UserController {

    private final UserService userService;// create user service object

    public UserController(UserService userService) {//  constructor
        this.userService = userService;
    }

    // Update role
    @PreAuthorize("hasRole('ADMIN')")// only admin role thiyena user lata onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
    @PutMapping("/{id}/role") 
    public User updateRole(@PathVariable Long id, @RequestParam Role role) {// URL path ekt id gannva, query parameter ekt role gannva, user service call karala role update karanva, updated user return karanva
        return userService.updateRole(id, role);
    }

    @GetMapping("/me")// get current user details, frontend ekata user data display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
    public ResponseEntity<User> getCurrentUser(@RequestParam String email) {// query parameter ekn email gannva, user service call karala email ekt user data gannva, user data return karanva
        if (email == null || email.isEmpty()) { // email nullnm bad request error return karanva, email is required kiyala message return karanva
            throw new RuntimeException("Email is required");
        }

        return ResponseEntity.ok(userService.getUserByEmail(email)); // user service call karala email ekt user data gannva, user data return karanva
    }

    @PutMapping("/update") // update user details, frontend ekata user data display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
    public User updateUser(@RequestBody User updatedUser) { // frontend ekem ena json data user object ekt conver karanva, user service call karala user data update karanva, updated user return karanva
        return userService.updateUser(updatedUser); // user service call karala user data update karanva, updated user return karanva
    }

    @PutMapping("/change-password") // change password endpoint
    public String changePassword(@RequestBody User req) {// frontend ekem ena json data user object ekt conver karanva, user service call karala password change karanva, success message return karanva
        userService.changePassword(req.getEmail(), req.getPassword());
        return "Password updated";
    }

    @PreAuthorize("hasRole('ADMIN')")//admin can only access
    @GetMapping("/all")
    public List<User> getAllUsers(Authentication auth) {// get all users, only admin can access, frontend ekata user list display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
        System.out.println("AUTH IN CONTROLLER: " + auth);
        return userService.getAllUsers(); // return all user list
    }

    @PutMapping("/toggle/{id}") // switch user active/inactive, only admin can access, frontend ekata user list display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUser(id));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {// frontend ekem ena json map ekak vidiyt gannva 

        if (req == null || !req.containsKey("email")) {// check email is present in request body, if not return bad request error, email is required message return karanva
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            String email = req.get("email"); //get email from request body, user service call karala forgot password process run karanva, response return karanva

            String response = userService.forgotPassword(email); //call userservice forgot password method, email ekt forgot password process run karanva, response return karanva

            return ResponseEntity.ok(response);//retuen  success response

        } catch (RuntimeException ex) {// handle runtime exception, print stack trace, return bad request error with exception message
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace(); // 🔥 IMPORTANT

            return ResponseEntity // error handling
                    .status(500)
                    .body("Server error occurred");
        }
    }

    @PreAuthorize("hasRole('TECHNICIAN')") // only teshnician can access
    @GetMapping("/technician/jobs")
    public String getTechnicianJobs(Authentication auth) {// get technician jobs, only technician can access, frontend ekata technician job list display karanna use karanva, onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva

        System.out.println("TECHNICIAN LOGIN: " + auth.getName());

        return "Technician jobs for: " + auth.getName();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role);
    }

}
