package com.ge.bo.repository;

import com.ge.bo.entity.CodeGroup;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodeGroupRepository extends JpaRepository<CodeGroup, Long> {

    @EntityGraph(attributePaths = {"details"})
    List<CodeGroup> findAllByOrderByIdDesc();

    boolean existsByGroupCode(String groupCode);
}
