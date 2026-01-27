---
description: Create a new feature following best practices
---

# New Feature Development Workflow

This workflow guides you through creating a new feature with proper structure and testing.

## Steps

1. **Plan the feature**
   - Create a design doc in `C:\Users\LENOVO\.gemini\antigravity\brain\693f8ac1-afea-4689-9f52-7d23525e6835\implementation_plan.md`
   - Define user stories
   - Identify affected components
   - Plan database schema changes if needed

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up feature structure**
   - Create component files in appropriate directories
   - Follow existing naming conventions
   - Keep components modular and reusable

4. **Implement backend logic**
   - Create API endpoints in `/api`
   - Add database models if needed
   - Implement business logic in service layer
   - Add proper error handling

5. **Implement frontend UI**
   - Follow Booke.ai design inspiration
   - Use design system components
   - Ensure responsive design
   - Add proper loading and error states

6. **Write tests**
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Aim for >80% code coverage

// turbo
7. **Run tests**
   ```bash
   npm test
   ```

8. **Manual testing**
   - Test happy path
   - Test error scenarios
   - Test edge cases
   - Check mobile responsiveness

9. **Code review**
   - Self-review code
   - Run linter and fix issues
   - Check for security vulnerabilities
   - Ensure code follows project conventions

10. **Create pull request**
    - Write clear PR description
    - Link related issues
    - Add screenshots for UI changes
    - Request review from team

## Feature Checklist

- [ ] Feature is properly scoped and planned
- [ ] Code follows project structure
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Works on mobile and desktop
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Performance is acceptable
- [ ] Security considerations addressed

## Best Practices

- Keep features small and focused
- Write self-documenting code
- Use TypeScript for type safety
- Follow component composition patterns
- Implement proper error boundaries
- Add telemetry for important actions
