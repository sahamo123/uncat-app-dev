# IDE Workflows and Rules Summary

## Created Workflows

I've set up **6 custom workflows** in `.agent/workflows/` that you can trigger with slash commands:

### 1. **`/dev-setup`** - Local Development Setup
- Verifies Node.js installation
- Installs dependencies (auto-runnable with `// turbo`)
- Sets up environment variables
- Runs database migrations
- Starts dev server
- **Use when**: Setting up the project for the first time or after pulling major changes

### 2. **`/test`** - Run Tests and Code Quality
- Runs unit tests, integration tests
- Checks code formatting and linting
- Performs type checking
- Runs comprehensive CI checks
- **Use when**: Before committing code or creating a PR

### 3. **`/rag-testing`** - Test RAG & AI Features
- Tests vector similarity search
- Tests OpenAI integration
- Tests hybrid RAG pipeline (vector + OpenAI)
- Tests batch categorization
- **Use when**: Working on AI categorization features or debugging RAG performance

### 4. **`/quickbooks-sync`** - Test QuickBooks Integration
- Verifies OAuth setup
- Tests connection and authentication
- Fetches and syncs transactions
- Includes troubleshooting guide
- **Use when**: Working on QuickBooks integration or debugging sync issues

### 5. **`/deploy`** - Deploy to Production
- Pre-deployment checks
- Builds production bundle
- Runs migrations
- Deployment steps with verification
- Rollback procedures
- **Use when**: Deploying to production (includes safety checklists)

### 6. **`/new-feature`** - Create New Features
- Feature planning guidelines
- Backend and frontend implementation steps
- Testing checklist
- Code review process
- **Use when**: Starting work on a new feature

## Project Rules

I've created a comprehensive **`.agent/rules.md`** file covering:

### Code Style & Structure
- TypeScript-first approach with strict mode
- Atomic design component structure
- File naming conventions
- Error handling requirements

### Architecture Rules
- **Hybrid RAG approach** (vector DB + OpenAI)
- Architecture open for future ML integration
- Multi-tenant design
- API-first architecture

### Design System
- Follow Booke.ai design inspiration
- 4px grid system
- Design tokens in `globals.css`
- Mobile-first responsive design

### QuickBooks Integration
- OAuth 2.0 only
- Sandbox for development
- Rate limiting and webhook verification

### AI/RAG Implementation
- Vector search before OpenAI calls
- Context window limits (top 5 similar transactions)
- Confidence scoring
- Cost monitoring

### Testing, Security, Performance
- >80% code coverage target
- Security best practices (input validation, SQL injection prevention)
- Performance targets (bundle size, caching)

### Git Workflow & Documentation
- Feature branches with conventional commits
- Code review requirements
- Documentation standards

## How to Use These

1. **Trigger workflows** by typing the slash command (e.g., `/test`) in your IDE
2. **Auto-runnable steps**: Workflows with `// turbo` annotations will auto-run commands without asking for approval
3. **Rules are enforced**: The AI assistant will reference `.agent/rules.md` when writing code to follow project conventions

## Benefits

✅ **Consistency**: All developers follow the same processes  
✅ **Speed**: Auto-runnable commands save time  
✅ **Quality**: Built-in checklists prevent mistakes  
✅ **Knowledge**: New team members can learn workflows quickly  
✅ **Scalability**: Easy to add more workflows as the project grows

## Next Steps

You can now:
- Use `/dev-setup` to initialize your environment
- Customize workflows based on your specific needs
- Add more workflows as you identify repetitive tasks
- Update rules as the project evolves
