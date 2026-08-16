package com.mindmaze.repository;

import com.mindmaze.entity.MysteryCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MysteryCaseRepository extends JpaRepository<MysteryCase, Long> {
    List<MysteryCase> findByIsUnlockedTrue();
}
