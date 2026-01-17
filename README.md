# 🚀 OpenCode Flow v1.0: AI Swarm Coordination for OpenCode

<div align="center">

[![🌟 OpenCode](https://img.shields.io/badge/OpenCode-Integrated-blue?style=for-the-badge&logo=opencode)](https://opencode.ai)
[![📈 Downloads](https://img.shields.io/npm/dt/opencode-flow?style=for-the-badge&logo=npm&color=blue&label=Downloads)](https://www.npmjs.com/package/opencode-flow)
[![📦 Latest Release](https://img.shields.io/npm/v/opencode-flow/alpha?style=for-the-badge&logo=npm&color=green&label=v1.0.0)](https://www.npmjs.com/package/opencode-flow)
[![🔧 MCP](https://img.shields.io/badge/MCP-Tools%20Ready-purple?style=for-the-badge)](https://modelcontextprotocol.io)
[![🛡️ MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)

</div>

## 🌟 **Overview**

**OpenCode Flow v1.0** is an advanced AI orchestration platform for OpenCode that brings **hive-mind swarm intelligence**, **AgentDB memory**, and **100+ MCP tools** to revolutionize AI-powered development workflows.

### 🎯 **Key Features**

- **🐝 64+ Specialized Agents** - Coder, reviewer, architect, tester, security experts, and more
- **🚀 SPARC Methodology** - 5-phase TDD workflow (Specification, Pseudocode, Architecture, Refinement, Completion)
- **🧠 AgentDB v1.6.1 Integration**: 96x-164x faster vector search with semantic understanding
- **💾 Hybrid Memory System**: AgentDB + ReasoningBank with automatic fallback
- **🔍 Semantic Vector Search**: HNSW indexing (O(log n)) + 9 RL algorithms
- **🐝 Hive-Mind Intelligence**: Queen-led AI coordination with specialized worker agents
- **🔧 100+ MCP Tools**: Comprehensive toolkit for swarm orchestration and automation
- **🔄 Dynamic Agent Architecture (DAA)**: Self-organizing agents with fault tolerance
- **🪝 Advanced Hooks System**: Automated workflows with pre/post operation hooks
- **📊 GitHub Integration**: Specialized modes for repository management
- **🌐 Provider Agnostic**: Works with OpenAI, Anthropic, Google, local models via OpenCode

> 🔥 **Built for OpenCode**: Advanced AI coordination that integrates seamlessly with OpenCode's tool system and agent architecture
>
> 🆕 **Based on Claude Flow**: OpenCode Flow is a fork of Claude Flow v2.7, adapted for OpenCode users


---

## ⚡ **Quick Start for OpenCode**

### 📋 **Prerequisites**

- **OpenCode** - The open source AI coding agent (https://opencode.ai)
- **Node.js 20+** (LTS recommended)
- **npm/pnpm 9+** or equivalent package manager
- **Windows users**: See [Windows Installation Guide](./docs/windows-installation.md) for special instructions

### 🚀 **Install OpenCode Flow**

```bash
# NPX (recommended - always latest)
npx opencode-flow@alpha init --force
npx opencode-flow@alpha --help

# Or install globally
npm install -g opencode-flow@alpha
opencode-flow --version
# v1.0.0-alpha.1
```

### 🔌 **Setup with OpenCode**

```bash
# Option 1: Add as OpenCode MCP server
opencode mcp add opencode-flow npx opencode-flow mcp start

# Option 2: Install as OpenCode plugin
opencode plugin install @opencode-flow/plugin

# Option 3: Use standalone with OpenCode
opencode-flow init --opencode-integration
```

---

## 🎨 **OpenCode Integration**

OpenCode Flow integrates seamlessly with OpenCode's tool system:

```bash
# Just describe what you want - tools activate automatically in OpenCode
"Let's pair program on this feature"        → pair-programming mode
"Review this PR for security issues"       → code-review with security agents
"Use vector search to find similar code"   → semantic memory search
"Create a swarm to build this API"         → multi-agent swarm coordination
```

**Available as OpenCode Tools:**
- **Swarm Coordination** - Multi-agent orchestration and hive-mind
- **Memory & Intelligence** - AgentDB integration with 96x-164x performance
- **SPARC Methodology** - TDD-based development workflow
- **GitHub Integration** - PR review, workflows, releases, multi-repo
- **Automation & Quality** - Hooks, verification, performance analysis

---

## 🆕 **What's New in v1.0.0-alpha.1**

### ✅ **OpenCode Flow Launch**
First release of OpenCode Flow - a fork of Claude Flow adapted for OpenCode:
- ✅ Rebranded as OpenCode Flow
- ✅ Updated for OpenCode integration
- ✅ Preserved all core features from Claude Flow v2.7
- ✅ Modified commands to work with OpenCode CLI
- ✅ Added OpenCode-specific documentation (OPENCODE.md)
- ✅ Compatible with OpenCode's tool system
- ✅ Works with OpenCode's provider architecture (OpenAI, Anthropic, Google, local models)

### 🧠 **ReasoningBank Integration (agentic-flow@1.5.13)**
- **Node.js Backend**: Replaced WASM with SQLite + better-sqlite3
- **Persistent Storage**: All memories saved to `.swarm/memory.db`
- **Semantic Search**: MMR ranking with 4-factor scoring
- **Database Tables**: patterns, embeddings, trajectories, links
- **Performance**: 2ms queries, 400KB per pattern with embeddings

```bash
# Semantic search now fully functional
npx claude-flow@alpha memory store test "API configuration" --namespace semantic --reasoningbank
npx claude-flow@alpha memory query "configuration" --namespace semantic --reasoningbank
# ✅ Found 3 results (semantic search) in 2ms
```

📚 **See [OPENCODE.md](./OPENCODE.md)** for detailed OpenCode integration guide

## 🧠 **Memory System Commands**

### **🚀 AgentDB v1.6.1 Integration (96x-164x Performance Boost)**

**Revolutionary Performance Improvements:**
- **Vector Search**: 96x faster (9.6ms → <0.1ms)
- **Batch Operations**: 125x faster
- **Large Queries**: 164x faster
- **Memory Usage**: 4-32x reduction via quantization

```bash
# Semantic vector search (understands meaning, not just keywords)
opencode-flow memory vector-search "user authentication flow" \
  --k 10 --threshold 0.7 --namespace backend

# Store with vector embedding for semantic search
opencode-flow memory store-vector api_design "REST endpoints" \
  --namespace backend --metadata '{"version":"v2"}'

# Get AgentDB integration status and capabilities
opencode-flow memory agentdb-info

# Installation (hybrid mode - 100% backward compatible)
npm install agentdb@1.6.1
```

**New Features:**
- ✅ **Semantic vector search** (HNSW indexing, O(log n))
- ✅ **9 RL algorithms** (Q-Learning, PPO, MCTS, Decision Transformer)
- ✅ **Reflexion memory** (learn from past experiences)
- ✅ **Skill library** (auto-consolidate successful patterns)
- ✅ **Causal reasoning** (understand cause-effect relationships)
- ✅ **Quantization** (binary 32x, scalar 4x, product 8-16x reduction)
- ✅ **100% backward compatible** (hybrid mode with graceful fallback)

**Documentation**: `docs/agentdb/PRODUCTION_READINESS.md` | **PR**: #830

---

### **ReasoningBank (Legacy SQLite Memory - Still Supported)**

```bash
# Store memories with pattern matching
opencode-flow memory store api_key "REST API configuration" \
  --namespace backend --reasoningbank

# Query with pattern search (2-3ms latency)
opencode-flow memory query "API config" \
  --namespace backend --reasoningbank
# ✅ Found 3 results (pattern matching)

# List all memories
opencode-flow memory list --namespace backend --reasoningbank

# Check status and statistics
opencode-flow memory status --reasoningbank
# ✅ Total memories: 30
#    Embeddings: 30
#    Storage: .swarm/memory.db
```

**Features:**
- ✅ **No API Keys Required**: Hash-based embeddings (1024 dimensions)
- ✅ **Persistent Storage**: SQLite database survives restarts
- ✅ **Pattern Matching**: LIKE-based search with similarity scoring
- ✅ **Namespace Isolation**: Organize memories by domain
- ✅ **Fast Queries**: 2-3ms average latency
- ✅ **Process Cleanup**: Automatic database closing

**Optional Enhanced Embeddings:**
```bash
# For better semantic accuracy with text-embedding-3-small (1536 dimensions)
# Set OPENAI environment variable (see ReasoningBank documentation)
```

---

## 🐝 **Swarm Orchestration**

### **Quick Swarm Commands**

```bash
# Quick task execution (recommended)
opencode-flow swarm "build REST API with authentication"

# Multi-agent coordination
opencode-flow swarm init --topology mesh --max-agents 5
opencode-flow agent spawn researcher "analyze API patterns"
opencode-flow agent spawn coder "implement endpoints"
opencode-flow swarm status
```

### **Hive-Mind for Complex Projects**

```bash
# Initialize hive-mind system
opencode-flow hive-mind wizard
opencode-flow hive-mind spawn "build enterprise system"

# Session management
opencode-flow hive-mind status
opencode-flow hive-mind resume session-xxxxx
```

**When to Use:**
| Feature | `swarm` | `hive-mind` |
|---------|---------|-------------|
| **Best For** | Quick tasks | Complex projects |
| **Setup** | Instant | Interactive wizard |
| **Memory** | Task-scoped | Project-wide SQLite |
| **Sessions** | Temporary | Persistent + resume |

---

## 🔧 **OpenCode Integration**

### **Setup with OpenCode**

```bash
# Add OpenCode Flow MCP server to OpenCode
opencode mcp add opencode-flow npx opencode-flow mcp start

# Or install as OpenCode plugin
opencode plugin install @opencode-flow/plugin

# Verify installation
opencode mcp list
```

### **Available Tools in OpenCode (100+ Total)**

**Swarm Tools:**
- `swarm_init` - Initialize swarm coordination
- `swarm_spawn` - Spawn specialized agents
- `swarm_status` - Check swarm status
- `swarm_execute_parallel` - Execute tasks in parallel

**Memory Tools:**
- `memory_store` - Store with semantic search
- `memory_search` - Pattern-based search
- `memory_vector_search` - HNSW vector search

**SPARC Tools:**
- `sparc_modes` - List SPARC methodology modes
- `sparc_run` - Execute specific SPARC phase
- `sparc_tdd` - Run complete TDD workflow

**Agent Tools:**
- `agent_spawn` - Spawn specific agent type
- `agent_list` - List active agents
- `agent_status` - Get agent status

📚 **Full Reference**: [MCP Tools Documentation](./docs/MCP-TOOLS.md) | **OpenCode Guide**: [OPENCODE.md](./OPENCODE.md)

---

## 🪝 **Advanced Hooks System**

### **Automated Workflow Enhancement**

Claude-Flow automatically configures hooks for enhanced operations:

```bash
# Auto-configures hooks during init
npx claude-flow@alpha init --force
```

### **Available Hooks**

**Pre-Operation:**
- `pre-task`: Auto-assigns agents by complexity
- `pre-edit`: Validates files and prepares resources
- `pre-command`: Security validation

**Post-Operation:**
- `post-edit`: Auto-formats code
- `post-task`: Trains neural patterns
- `post-command`: Updates memory

**Session Management:**
- `session-start`: Restores previous context
- `session-end`: Generates summaries
- `session-restore`: Loads memory

---

## 🎯 **Common Workflows**

### **Pattern 1: Single Feature Development**
```bash
# Initialize once per feature
opencode-flow init --force
opencode-flow hive-mind spawn "Implement authentication"

# Continue same feature (reuse hive)
opencode-flow memory query "auth" --recent
opencode-flow swarm "Add password reset" --continue-session
```

### **Pattern 2: Multi-Feature Project**
```bash
# Project initialization
opencode-flow init --force --project-name "my-app"

# Feature 1: Authentication
opencode-flow hive-mind spawn "auth-system" --namespace auth

# Feature 2: User management
opencode-flow hive-mind spawn "user-mgmt" --namespace users
```

### **Pattern 3: Research & Analysis**
```bash
# Start research session
opencode-flow hive-mind spawn "Research microservices" \
  --agents researcher,analyst

# Check learned knowledge
opencode-flow memory stats
opencode-flow memory query "microservices patterns" --reasoningbank
```

---

## 📊 **Performance & Stats**

- **84.8% SWE-Bench solve rate** - Industry-leading problem-solving
- **32.3% token reduction** - Efficient context management
- **2.8-4.4x speed improvement** - Parallel coordination
- **96x-164x faster search** - 🆕 AgentDB vector search (9.6ms → <0.1ms)
- **4-32x memory reduction** - 🆕 AgentDB quantization
- **2-3ms query latency** - ReasoningBank pattern search (legacy)
- **64 specialized agents** - Complete development ecosystem
- **100 MCP tools** - Comprehensive automation toolkit
- **180 AgentDB tests** - >90% coverage, production-ready

---

## 📚 **Documentation**

### **📖 Core Documentation**
- **[Documentation Hub](./docs/)** - Complete documentation index with organized structure
- **[Skills Tutorial](./docs/guides/skills-tutorial.md)** - Complete guide to 25 Claude Flow skills with natural language invocation
- **[Installation Guide](./docs/INSTALLATION.md)** - Setup instructions
- **[Memory System Guide](./docs/MEMORY-SYSTEM.md)** - ReasoningBank + AgentDB hybrid
- **[MCP Tools Reference](./docs/MCP-TOOLS.md)** - Complete tool catalog
- **[Agent System](./docs/AGENT-SYSTEM.md)** - All 64 agents

### **🚀 Release Notes & Changelogs**
- **[v2.7.1](./docs/releases/v2.7.1/)** - Current stable release with critical fixes
- **[v2.7.0-alpha.10](./docs/releases/v2.7.0-alpha.10/)** - Semantic search fix
- **[v2.7.0-alpha.9](./docs/releases/v2.7.0-alpha.9/)** - Process cleanup
- **[Changelog](./CHANGELOG.md)** - Full version history

### **🧠 AgentDB Integration (96x-164x Performance Boost)**
- **[AgentDB Documentation](./docs/agentdb/)** - 🆕 Complete AgentDB v1.3.9 integration docs
  - [Production Readiness Guide](./docs/agentdb/PRODUCTION_READINESS.md) - Deployment guide
  - [Implementation Complete](./docs/agentdb/SWARM_IMPLEMENTATION_COMPLETE.md) - 3-agent swarm details (180 tests)
  - [Backward Compatibility](./docs/agentdb/BACKWARD_COMPATIBILITY_GUARANTEE.md) - 100% compatibility guarantee
  - [Integration Plan](./docs/agentdb/AGENTDB_INTEGRATION_PLAN.md) - Planning and design
  - [Optimization Report](./docs/agentdb/OPTIMIZATION_REPORT.md) - Performance analysis

### **⚡ Performance & Quality**
- **[Performance Documentation](./docs/performance/)** - Optimization guides and benchmarks
  - [JSON Improvements](./docs/performance/PERFORMANCE-JSON-IMPROVEMENTS.md) - JSON optimization results
  - [Metrics Guide](./docs/performance/PERFORMANCE-METRICS-GUIDE.md) - Performance tracking
- **[Bug Fixes](./docs/fixes/)** - Bug fix documentation and patches
- **[Validation Reports](./docs/validation/)** - Test reports and verification results

### **🛠️ Advanced Topics**
- **[Neural Module](./docs/NEURAL-MODULE.md)** - SAFLA self-learning
- **[Goal Module](./docs/GOAL-MODULE.md)** - GOAP intelligent planning
- **[Hive-Mind Intelligence](./docs/HIVE-MIND.md)** - Queen-led coordination
- **[GitHub Integration](./docs/GITHUB-INTEGRATION.md)** - Repository automation

### **⚙️ Configuration & Setup**
- **[CLAUDE.md Templates](./docs/CLAUDE-MD-TEMPLATES.md)** - Project configs
- **[SPARC Methodology](./docs/SPARC.md)** - TDD patterns
- **[Windows Installation](./docs/windows-installation.md)** - Windows setup

---

## 🤝 **Community & Support**

- **GitHub Issues**: [Report bugs or request features](https://github.com/tannht/claude-flow/issues)
- **OpenCode Discord**: [Join the OpenCode community](https://opencode.ai/discord)
- **Documentation**: [Complete guides and tutorials](./docs/)
- **OpenCode**: [https://opencode.ai](https://opencode.ai)

---

## 🚀 **Roadmap**

### **v1.0.0 (Current - Alpha)**
- ✅ Core swarm coordination from Claude Flow
- ✅ SPARC methodology
- ✅ AgentDB memory integration
- ✅ MCP tools for OpenCode
- ✅ OpenCode plugin

### **v1.1.0 (Planned)**
- [ ] Enhanced OpenCode UI integration
- [ ] Web dashboard for swarm monitoring
- [ ] Team collaboration features
- [ ] Advanced neural learning capabilities
- [ ] Multi-provider model routing

### **v1.2.0 (Future)**
- [ ] Real-time agent communication
- [ ] Enterprise SSO integration
- [ ] Custom agent builder UI
- [ ] Performance analytics dashboard

---

## Star History

<a href="https://www.star-history.com/#ruvnet/claude-flow&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ruvnet/claude-flow&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ruvnet/claude-flow&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ruvnet/claude-flow&type=Date" />
 </picture>
</a>

---

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) for details

---

**Built with ❤️ for OpenCode** | **Forked from Claude Flow** 🌊

*OpenCode Flow v1.0.0-alpha.1 - AI Swarm Coordination for OpenCode*

**[OpenCode](https://opencode.ai)** | **[GitHub](https://github.com/tannht/claude-flow)**

</div>
