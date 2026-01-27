# Decision Tree System - Documentation

## Overview
The decision tree provides an interactive, user-friendly way for clients to categorize transactions when AI confidence is low (<90%). Instead of making clients think like accountants, it guides them through natural questions.

## File Location
**File**: [decision_tree_logic.json](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/decision_tree_logic.json)

## How It Works

### Flow
1. **AI Attempts Auto-Categorization** (using RAG + LLM)
2. **If confidence < 90%** → Show decision tree to client
3. **Client answers 2-5 questions** (average 3)
4. **Tree assigns category** with confidence score
5. **AI learns from choice** (feedback loop)

### Example User Flow

```
Transaction: $127.50 to "Joe's Diner"

❌ AI Confidence: 75% (too low to auto-categorize)
✅ Show Decision Tree:

Q1: Is this money going OUT or coming IN?
→ User selects: "Money OUT"

Q2: What type of expense?
→ User selects: "Operating Expense"

Q3: Which category?
→ User selects: "Meals & Entertainment"

Q4: What was the business purpose?
→ User selects: "Client meeting/entertainment"

Q5: Was specific business discussed?
→ User selects: "Yes - Specific business discussed"

Result: ✅ "Meals & Entertainment:Client" (50% deductible)
```

## Structure

### Node Types

**1. Choice Node**
```json
{
  "question": "What type of expense is this?",
  "type": "choice",
  "options": [
    {"label": "Operating Expense", "next": "operating_category"},
    {"label": "Asset Purchase", "next": "asset_type"}
  ]
}
```

**2. Terminal Node** (assigns category)
```json
{
  "label": "Online Ads",
  "category": "Advertising:Online",
  "confidence": 0.95,
  "taxNote": "100% deductible"
}
```

**3. Text Input Node** (for edge cases)
```json
{
  "question": "Describe this expense",
  "type": "text_input",
  "category": "Other Expenses",
  "instruction": "AI will analyze"
}
```

## Key Features

### 1. Tax Notes
Embedded IRS guidance for common scenarios:
- "50% deductible" (most meals)
- "100% deductible" (office snacks)
- "Keep mileage log" (vehicle expenses)
- "Section 179 may apply" (equipment)

### 2. 1099 Flagging
Automatically flags contractor payments >$600:
```json
{
  "category": "Contract Labor",
  "flagFor1099": true
}
```

### 3. Special Instructions
Guides for complex situations:
```json
{
  "instruction": "Split into Interest (deductible) and Principal (not deductible)"
}
```

## Customization

### Adding a New Category

1. **Find the parent node** (e.g., `operating_category`)
2. **Add new option**:
```json
{
  "label": "R&D Expenses",
  "next": "rd_detail"
}
```
3. **Create detail node**:
```json
"rd_detail": {
  "question": "What type of R&D?",
  "type": "choice",
  "options": [
    {"label": "Lab Equipment", "category": "R&D:Equipment", "confidence": 0.95},
    {"label": "Research Materials", "category": "R&D:Materials", "confidence": 0.95}
  ]
}
```

### Industry-Specific Trees

You can create custom trees for specific industries:

**Example: Restaurant**
```json
{
  "industry": "restaurant",
  "custom_nodes": {
    "food_cost": {
      "question": "Is this for ingredients or supplies?",
      "options": [
        {"label": "Food ingredients", "category": "COGS:Food", "confidence": 0.95},
        {"label": "Kitchen supplies", "category": "Supplies:Kitchen", "confidence": 0.95}
      ]
    }
  }
}
```

## Integration with AI

### Feedback Loop
```typescript
// After user completes tree
async function learnFromDecisionTree(transaction, finalCategory) {
  // 1. Store the path user took
  await db.insert('decision_tree_history', {
    transaction_id: transaction.id,
    vendor: transaction.vendor,
    amount: transaction.amount,
    category_chosen: finalCategory,
    path_taken: ['expense_type', 'meals_detail', 'client_meal']
  });
  
  // 2. Update RAG embeddings
  await db.query(`
    INSERT INTO vendor_patterns (vendor, category, confidence)
    VALUES ($1, $2, 0.95)
    ON CONFLICT (vendor) DO UPDATE
    SET category = $2, confidence = vendor_patterns.confidence + 0.1
  `, [transaction.vendor, finalCategory]);
  
  // 3. Next time this vendor appears, AI will auto-categorize with higher confidence
}
```

### Confidence Threshold

Current settings:
- **>90%**: Auto-categorize (client sees result, can override)
- **70-90%**: Show top 3 suggestions + "or use decision tree"
- **<70%**: Immediately show decision tree

## UI/UX Considerations

### Progressive Disclosure
Only show relevant questions based on previous answers.

### Mobile-Friendly
- Large touch targets
- Swipe gestures (Tinder-style)
- Voice input option for descriptions

### Undo Functionality
Allow users to go back if they made a mistake:
```typescript
const [questionHistory, setQuestionHistory] = useState([]);

function goBack() {
  const previous = questionHistory.pop();
  setCurrentNode(previous);
}
```

## Admin Features

### Tree Analytics
Track which paths are most common:
```sql
SELECT 
  path_taken,
  COUNT(*) as usage_count,
  AVG(confidence) as avg_confidence
FROM decision_tree_history
GROUP BY path_taken
ORDER BY usage_count DESC
LIMIT 10;
```

### A/B Testing
Test different question phrasings:
```json
{
  "question_variants": [
    "What type of expense is this?",
    "How would you categorize this cost?",
    "Which bucket does this fall into?"
  ],
  "track_conversion_rate": true
}
```

## Future Enhancements

1. **Smart Shortcuts**: After 3 clicks, if AI detects pattern, suggest "Always categorize [Vendor] as [Category]"
2. **Visual Mode**: Show icons instead of text for common categories
3. **Batch Mode**: "Apply to all similar transactions"
4. **Multi-Language**: Translate questions based on user locale

## Testing

### Sample Test Cases
```typescript
describe('Decision Tree Navigation', () => {
  test('Expense: Client Meal', async () => {
    const result = await walkTree([
      'Money OUT',
      'Operating Expense',
      'Meals & Entertainment',
      'Client meeting',
      'Yes - Specific business'
    ]);
    
    expect(result.category).toBe('Meals & Entertainment:Client');
    expect(result.taxNote).toBe('50% deductible');
  });
  
  test('Income: Customer Payment', async () => {
    const result = await walkTree([
      'Money IN',
      'Customer Payment',
      'Services rendered'
    ]);
    
    expect(result.category).toBe('Service Revenue');
  });
});
```

---

**Related Files**:
- [Implementation Plan](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/implementation_plan.md)
- [Core Platform Spec](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/01_core_platform/spec.md)
