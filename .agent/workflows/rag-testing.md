---
description: Test RAG and AI categorization features
---

# RAG & AI Testing Workflow

This workflow helps test the hybrid RAG approach for transaction categorization and AI features.

## Steps

1. **Prepare test data**
   - Ensure you have sample QuickBooks transactions in `tests/fixtures/transactions.json`
   - Verify vector database has seed data

// turbo
2. **Test vector similarity search**
   ```bash
   npm run test:vector-search
   ```
   This tests the local vector database retrieval for similar transactions.

// turbo
3. **Test OpenAI integration**
   ```bash
   npm run test:openai
   ```
   This verifies OpenAI API calls for context enhancement and categorization.

// turbo
4. **Test hybrid RAG pipeline**
   ```bash
   npm run test:rag-pipeline
   ```
   This tests the complete flow:
   - Vector search for similar transactions
   - Context building from historical data
   - OpenAI-enhanced categorization
   - Confidence scoring

5. **Manual verification**
   - Navigate to the categorization UI
   - Upload a test transaction
   - Verify AI suggestions are relevant
   - Check confidence scores are accurate

// turbo
6. **Test batch processing**
   ```bash
   npm run test:batch-categorization
   ```

## Expected Results

- Vector search should return relevant similar transactions
- OpenAI should provide accurate category suggestions
- Confidence scores should correlate with accuracy
- Batch processing should handle multiple transactions efficiently

## Notes

- Keep API costs in mind when testing OpenAI integration
- Use cached responses for development when possible
- Monitor vector database performance with large datasets
