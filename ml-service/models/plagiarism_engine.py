"""
PlagiarismEngine — detects suspiciously similar quiz responses.

Compares every pair of students' answers using Jaccard similarity.
If two people gave the same answers to 80%+ of the questions, that's
a pretty strong signal that something fishy is going on.

This runs post-quiz (not real-time) and is called from the Spring Boot
backend after all attempts are submitted.
"""

from itertools import combinations


class PlagiarismEngine:

    def analyze(self, attempts_data: list) -> list:
        """
        Takes a list of attempt objects, each with:
            {"userId": "abc123", "responses": {"q1": "A", "q2": "B", ...}}
        
        Computes pairwise Jaccard similarity between all users.
        Returns flagged pairs where similarity exceeds the threshold.
        """
        results = []

        if len(attempts_data) < 2:
            return results  # need at least 2 people to compare

        # compare every unique pair of users
        for attempt_a, attempt_b in combinations(attempts_data, 2):
            user_a = attempt_a["userId"]
            user_b = attempt_b["userId"]
            responses_a = attempt_a.get("responses", {})
            responses_b = attempt_b.get("responses", {})

            similarity, matched, total = self._jaccard_similarity(responses_a, responses_b)

            results.append({
                "user_id_1": user_a,
                "user_id_2": user_b,
                "similarity_score": round(similarity, 4),
                "matched_answers": matched,
                "total_questions": total,
                "flagged": similarity > 0.8,
            })

        # sort by similarity descending so the most suspicious pairs are first
        results.sort(key=lambda r: r["similarity_score"], reverse=True)
        return results

    def _jaccard_similarity(self, responses_a: dict, responses_b: dict) -> tuple:
        """
        Compute Jaccard-style similarity between two sets of responses.
        
        We look at the union of all question IDs that either user answered,
        then count how many they answered the same way.
        
        Returns (similarity_score, matched_count, total_questions).
        """
        # get all questions that at least one person answered
        all_questions = set(responses_a.keys()) | set(responses_b.keys())
        total = len(all_questions)

        if total == 0:
            return (0.0, 0, 0)

        matched = 0
        for qid in all_questions:
            ans_a = responses_a.get(qid)
            ans_b = responses_b.get(qid)
            # both need to have answered, and their answers must match
            if ans_a is not None and ans_b is not None and ans_a == ans_b:
                matched += 1

        similarity = matched / total
        return (similarity, matched, total)
