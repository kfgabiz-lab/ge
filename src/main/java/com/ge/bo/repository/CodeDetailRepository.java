package com.ge.bo.repository;

import com.ge.bo.entity.CodeDetail;
import com.ge.bo.entity.CodeGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeDetailRepository extends JpaRepository<CodeDetail, Long> {

    boolean existsByGroupAndCode(CodeGroup group, String code);

    boolean existsByGroupAndCodeAndIdNot(CodeGroup group, String code, Long id);
}
