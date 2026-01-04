# Claude Code Configuration - Agentic Flow

## Project Setup

This project is configured with Agentic Flow for AI agent orchestration.

## Available Commands

### Quick Start
```bash
# Start MCP server for Claude Code integration
npx agentic-flow@alpha mcp start

# Run an agent directly
npx agentic-flow@alpha --agent coder --task "Your task here"

# List available agents
npx agentic-flow@alpha --list
```

### Hooks (Self-learning Intelligence)
```bash
npx agentic-flow@alpha hooks pre-edit <file>    # Get context before editing
npx agentic-flow@alpha hooks post-edit <file>   # Learn from edits
npx agentic-flow@alpha hooks route <task>       # Smart agent routing
```

### Workers (Background Tasks)
```bash
npx agentic-flow@alpha workers status           # Check worker status
npx agentic-flow@alpha workers dispatch <task>  # Dispatch background task
```

## Code Style

- Use TypeScript for new code
- Follow existing patterns in the codebase
- Add tests for new functionality

## Important Notes

- Never hardcode secrets - use environment variables
- Keep files under 500 lines when possible
- Write tests before implementation (TDD)
