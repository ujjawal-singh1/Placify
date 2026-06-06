package com.Placify.Repository;

import com.Placify.Entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizRepository extends MongoRepository<Quiz,String> {
    List<Quiz> findByCategory(String category);

    List<Quiz> findByTitle(String title);
    @Query(value = "{}", fields = "{ 'title' : 1 }")
    List<Quiz> findAllTitles();
}
