package com.rsl.roombooking.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rsl.roombooking.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByRole(String role);

	Optional<User> findFirstByRole(String role);

	List<User> findByRole(String role);
	
	List<User> findByCreatedBy(User admin);

}
