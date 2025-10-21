package com.trackmystack.backend.repositories;

import com.trackmystack.backend.models.StackActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StackActivityRepository extends JpaRepository<StackActivity, Long> {
    List<StackActivity> findAllByUserIdOrderByExecutedAtDesc(Long userId);
}