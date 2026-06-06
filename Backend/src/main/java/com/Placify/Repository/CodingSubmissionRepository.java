package com.Placify.Repository;

import com.Placify.Entity.CodingSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CodingSubmissionRepository extends MongoRepository<CodingSubmission, String> {

    List<CodingSubmission> findByUserId(String userId);

    List<CodingSubmission> findByProblemId(String problemId);

    List<CodingSubmission> findByUserIdAndProblemId(String userId, String problemId);

    List<CodingSubmission> findByUserIdAndStatus(String userId, String status);
}
