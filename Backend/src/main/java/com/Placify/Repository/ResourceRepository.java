package com.Placify.Repository;

import com.Placify.Entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ResourceRepository extends MongoRepository<Resource,String> {
    List<Resource> findBySubjectId(String subjectId);
}
