# Basic AI Explain Endpoint
- Provide simple explanations for words.
- Tasks:
+ Route: POST /ai/explain
+ Service: return mock/simple explanation
+ Integration test
- Acceptance Criteria:
+ Endpoint returns explanation
+ Works without external AI dependency

# Suggest Words Related to a Topic Using Embeddings
## Description
Implement a feature that allows users to input a topic (e.g. "work", "travel", "food") and receive a list of vocabulary words they have already learned that are relevant to that topic.

This feature will use embeddings and cosine similarity to match the topic with stored vocabulary words. The goal is to provide fast, accurate, and meaningful suggestions without requiring heavy AI processing on each request.

## Tasks
- Generate and store embeddings when a word is added
- Ensure all existing words have embeddings (data migration if needed)
- Create API endpoint POST /search-topic
- Generate embedding for the input topic
- Implement cosine similarity function
- Compare topic embedding with all stored word embeddings
- Sort results by similarity score (descending)
- Return top N results (e.g. top 20)

## Acceptance Criteria
- User can input a topic and receive related vocabulary words
- Results are based on similarity between topic and stored word embeddings
- API returns results in sorted order by relevance
- System handles at least 1,000 words efficiently (<500ms response time)
- Feature works for both single-word and multi-word topics
- No errors occur when user has no words or low matches
