package com.Placify.Repository;

import com.Placify.Entity.Question;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question,String> {
    List<Question> findByCategory(String category);

    @Aggregation(pipeline = {
            "{ '$match': { 'category': ?0 } }",
            "{ '$sample': { 'size': ?1 } }"
    })
    List<Question> findRandomQuestionsByCategory(String category,int numQ);

    // Fetch distinct categories
    @Aggregation(pipeline = {
            "{ '$group': { '_id': '$category' } }",
            "{ '$project': { 'category': '$_id', '_id': 0 } }"
    })
    List<String> findCategory();
}
