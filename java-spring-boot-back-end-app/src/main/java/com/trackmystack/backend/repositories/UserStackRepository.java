package com.trackmystack.backend.repositories;

import com.trackmystack.backend.models.UserStack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStackRepository extends JpaRepository<UserStack, Long> {
    List<UserStack> findAllByUserId(Long userId);
}