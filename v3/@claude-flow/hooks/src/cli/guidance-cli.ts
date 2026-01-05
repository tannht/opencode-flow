#!/usr/bin/env node
/**
 * V3 Guidance CLI
 *
 * Command-line interface for hooks guidance system.
 * Outputs plain text or JSON that Claude Code hooks can consume.
 *
 * Usage:
 *   npx @claude-flow/hooks session-context
 *   npx @claude-flow/hooks user-prompt "Fix authentication bug"
 *   npx @claude-flow/hooks pre-edit "/path/to/file.ts"
 *   npx @claude-flow/hooks route "Implement caching layer"
 *
 * @module @claude-flow/hooks/cli/guidance-cli
 */

import { GuidanceProvider } from '../reasoningbank/guidance-provider.js';
import { reasoningBank } from '../reasoningbank/index.js';
import { swarmComm } from '../swarm/index.js';
import { readFileSync } from 'fs';

const provider = new GuidanceProvider(reasoningBank);

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await provider.initialize();

    switch (command) {
      case 'session-context':
      case 'session':
        console.log(await provider.generateSessionContext());
        process.exit(0);
        break;

      case 'user-prompt':
      case 'prompt':
        console.log(await provider.generatePromptContext(args[1] || ''));
        process.exit(0);
        break;

      case 'pre-edit':
        console.log(JSON.stringify(await provider.generatePreEditGuidance(args[1] || '')));
        process.exit(0);
        break;

      case 'post-edit': {
        let content: string | undefined;
        try {
          content = readFileSync(args[1], 'utf-8');
        } catch {
          // File might not exist yet
        }
        console.log(JSON.stringify(await provider.generatePostEditFeedback(args[1] || '', content)));
        process.exit(0);
        break;
      }

      case 'pre-command':
        console.log(JSON.stringify(await provider.generatePreCommandGuidance(args[1] || '')));
        process.exit(0);
        break;

      case 'route':
        console.log(await provider.generateRoutingGuidance(args[1] || ''));
        process.exit(0);
        break;

      case 'stop-check': {
        const result = await provider.generateStopCheck();
        if (!result.shouldStop) {
          console.error(result.reason);
          process.exit(2);
        }
        process.exit(0);
        break;
      }

      case 'store': {
        const strategy = args[1] || '';
        const domain = args[2] || 'general';
        const result = await reasoningBank.storePattern(strategy, domain);
        console.log(JSON.stringify(result));
        process.exit(0);
        break;
      }

      case 'search': {
        const query = args[1] || '';
        const k = parseInt(args[2] || '5');
        const results = await reasoningBank.searchPatterns(query, k);
        console.log(JSON.stringify({
          patterns: results.map(r => ({
            id: r.pattern.id,
            strategy: r.pattern.strategy,
            domain: r.pattern.domain,
            similarity: r.similarity,
            quality: r.pattern.quality,
          })),
        }));
        process.exit(0);
        break;
      }

      case 'consolidate': {
        const result = await reasoningBank.consolidate();
        console.log(JSON.stringify(result));
        process.exit(0);
        break;
      }

      case 'stats':
        console.log(JSON.stringify(reasoningBank.getStats()));
        process.exit(0);
        break;

      case 'export': {
        const exported = await reasoningBank.exportPatterns();
        console.log(JSON.stringify({
          shortTermCount: exported.shortTerm.length,
          longTermCount: exported.longTerm.length,
          patterns: [...exported.shortTerm, ...exported.longTerm].map(p => ({
            id: p.id,
            strategy: p.strategy,
            domain: p.domain,
            quality: p.quality,
          })),
        }));
        process.exit(0);
        break;
      }

      case 'help':
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use --help for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
@claude-flow/hooks - V3 Guidance System CLI

Usage: npx @claude-flow/hooks <command> [args]

Guidance Commands (for Claude hooks):
  session-context           Output project context for SessionStart hook
  user-prompt <prompt>      Analyze prompt and inject relevant guidance
  pre-edit <path>           Validate and guide before file edit
  post-edit <path>          Provide feedback after file edit
  pre-command <cmd>         Risk assessment for bash commands
  route <task>              Suggest optimal agent for task
  stop-check                Verify work complete before stopping

Pattern Management:
  store <strategy> [domain] Store a new pattern
  search <query> [k]        Search for similar patterns
  consolidate               Deduplicate and promote patterns
  stats                     Get learning statistics
  export                    Export all patterns

Exit Codes:
  0 - Success (stdout added as context for Claude)
  2 - Block (stderr shown to Claude as reason)
  1 - Error

Examples:
  # Session start guidance
  npx @claude-flow/hooks session-context

  # User prompt analysis
  npx @claude-flow/hooks user-prompt "Fix authentication security vulnerability"

  # Pre-edit security check
  npx @claude-flow/hooks pre-edit "src/auth/login.ts"

  # Agent routing
  npx @claude-flow/hooks route "Implement HNSW vector search"

  # Store a learned pattern
  npx @claude-flow/hooks store "Use dependency injection for testability" architecture
`);
}

main().catch(console.error);
