package com.paf.backend.repository; // database access karana layer ek 

import com.paf.backend.model.Role;
import com.paf.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository; //CRUD operations automatic generate

import java.util.List;
import java.util.Optional; // null error avoid

// jpa repo use karala  DB  connection already thiyenva, method direct DB access karanva
public interface UserRepository extends JpaRepository<User, Long> { // userrepo inherit venva Jpa Repo ekath ekk , no need write manual  sql

    Optional<User> findByEmail(String email); // email ekt user find karanva, optional use karanva null error avoid karanva, if user not found then return empty optional

    List<User> findByRole(Role role);
}
