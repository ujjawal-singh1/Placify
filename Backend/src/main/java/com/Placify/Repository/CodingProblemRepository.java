package com.Placify.Repository;

import com.Placify.Entity.CodingProblem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CodingProblemRepository extends MongoRepository<CodingProblem, String> {

    List<CodingProblem> findByCategory(String category);

    List<CodingProblem> findByDifficulty(String difficulty);

    List<CodingProblem> findByCategoryAndDifficulty(String category, String difficulty);
}
