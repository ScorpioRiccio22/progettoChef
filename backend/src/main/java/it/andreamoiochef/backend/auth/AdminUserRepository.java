package it.andreamoiochef.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<AdminUser> findAllByOrderByCreatedAtAsc();

    long countByRoleAndEnabledTrue(AdminRole role);
}
