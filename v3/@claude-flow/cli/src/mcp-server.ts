/**
 * V3 CLI MCP Server Management
 *
 * Provides server lifecycle management for MCP integration:
 * - Start/stop/status methods with process management
 * - Health check endpoint integration
 * - Graceful shutdown handling
 * - PID file management for daemon detection
 * - Event-based status monitoring
 *
 * Performance Targets:
 * - Server startup: <400ms
 * - Health check: <10ms
 * - Graceful shutdown: <5s
 *
 * @module @claude-flow/cli/mcp-server
 * @version 3.0.0
 */

import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { createServer, Server } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

/**
 * MCP Server configuration
 */
export interface MCPServerOptions {
  transport?: 'stdio' | 'http' | 'websocket';
  host?: string;
  port?: number;
  pidFile?: string;
  logFile?: string;
  tools?: string[] | 'all';
  daemonize?: boolean;
  timeout?: number;
}

/**
 * MCP Server status
 */
export interface MCPServerStatus {
  running: boolean;
  pid?: number;
  transport?: string;
  host?: string;
  port?: number;
  uptime?: number;
  tools?: number;
  startedAt?: string;
  health?: {
    healthy: boolean;
    error?: string;
    metrics?: Record<string, number>;
  };
}

/**
 * Default configuration
 */
const DEFAULT_OPTIONS: Required<MCPServerOptions> = {
  transport: 'stdio',
  host: 'localhost',
  port: 3000,
  pidFile: path.join(os.tmpdir(), 'claude-flow-mcp.pid'),
  logFile: path.join(os.tmpdir(), 'claude-flow-mcp.log'),
  tools: 'all',
  daemonize: false,
  timeout: 30000,
};

/**
 * MCP Server Manager
 *
 * Manages the lifecycle of the MCP server process
 */
export class MCPServerManager extends EventEmitter {
  private options: Required<MCPServerOptions>;
  private process?: ChildProcess;
  private server?: Server;
  private startTime?: Date;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(options: MCPServerOptions = {}) {
    super();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<MCPServerStatus> {
    // Check if already running
    const status = await this.getStatus();
    if (status.running) {
      throw new Error(`MCP Server already running (PID: ${status.pid})`);
    }

    const startTime = performance.now();
    this.startTime = new Date();

    this.emit('starting', { options: this.options });

    try {
      if (this.options.transport === 'stdio') {
        // For stdio transport, spawn the server process
        await this.startStdioServer();
      } else {
        // For HTTP/WebSocket, start in-process server
        await this.startHttpServer();
      }

      const duration = performance.now() - startTime;

      // Write PID file
      await this.writePidFile();

      // Start health check monitoring
      this.startHealthMonitoring();

      const finalStatus = await this.getStatus();

      this.emit('started', {
        ...finalStatus,
        startupTime: duration,
      });

      return finalStatus;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Stop the MCP server
   */
  async stop(force = false): Promise<void> {
    const status = await this.getStatus();

    if (!status.running) {
      return;
    }

    this.emit('stopping', { force });

    try {
      // Stop health monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = undefined;
      }

      if (this.process) {
        // Graceful shutdown
        if (!force) {
          this.process.kill('SIGTERM');
          await this.waitForExit(5000);
        }

        // Force kill if still running
        if (this.process && !this.process.killed) {
          this.process.kill('SIGKILL');
        }

        this.process = undefined;
      }

      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server!.close(() => resolve());
        });
        this.server = undefined;
      }

      // Remove PID file
      await this.removePidFile();

      this.startTime = undefined;
      this.emit('stopped');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get server status
   */
  async getStatus(): Promise<MCPServerStatus> {
    // Check PID file
    const pid = await this.readPidFile();

    if (!pid) {
      return { running: false };
    }

    // Check if process is running
    const isRunning = this.isProcessRunning(pid);

    if (!isRunning) {
      // Clean up stale PID file
      await this.removePidFile();
      return { running: false };
    }

    // Build status
    const status: MCPServerStatus = {
      running: true,
      pid,
      transport: this.options.transport,
      host: this.options.host,
      port: this.options.port,
      startedAt: this.startTime?.toISOString(),
      uptime: this.startTime
        ? Math.floor((Date.now() - this.startTime.getTime()) / 1000)
        : undefined,
    };

    // Get health status for HTTP transport
    if (this.options.transport !== 'stdio') {
      status.health = await this.checkHealth();
    }

    return status;
  }

  /**
   * Check server health
   */
  async checkHealth(): Promise<{
    healthy: boolean;
    error?: string;
    metrics?: Record<string, number>;
  }> {
    if (this.options.transport === 'stdio') {
      // For stdio, just check if process is running
      const pid = await this.readPidFile();
      return {
        healthy: pid !== null && this.isProcessRunning(pid),
      };
    }

    // For HTTP/WebSocket, make health check request
    try {
      const response = await this.httpRequest(
        `http://${this.options.host}:${this.options.port}/health`,
        'GET',
        this.options.timeout
      );

      return {
        healthy: response.status === 'ok',
        metrics: {
          connections: response.connections || 0,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Restart the server
   */
  async restart(): Promise<MCPServerStatus> {
    await this.stop();
    return await this.start();
  }

  /**
   * Start stdio server process
   */
  private async startStdioServer(): Promise<void> {
    // Resolve server script path relative to this file
    const serverScript = path.resolve(
      __dirname,
      '../../../mcp/server-entry.ts'
    );

    // Check if tsx is available
    const command = 'npx';
    const args = [
      'tsx',
      serverScript,
      '--transport', this.options.transport,
      '--host', this.options.host,
      '--port', String(this.options.port),
    ];

    if (this.options.tools !== 'all') {
      args.push('--tools', this.options.tools.join(','));
    }

    this.process = spawn(command, args, {
      stdio: this.options.daemonize ? 'ignore' : ['pipe', 'pipe', 'pipe'],
      detached: this.options.daemonize,
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
        MCP_SERVER_MODE: 'true',
      },
    });

    if (this.options.daemonize) {
      this.process.unref();
    }

    // Handle process events
    this.process.on('error', (error) => {
      this.emit('error', error);
    });

    this.process.on('exit', (code, signal) => {
      this.emit('exit', { code, signal });
      this.process = undefined;
    });

    // Wait for server to be ready
    await this.waitForReady();
  }

  /**
   * Start HTTP server in-process
   */
  private async startHttpServer(): Promise<void> {
    // Dynamically import the MCP server
    const { MCPServer, createMCPServer } = await import('../../../mcp/server.js');

    const logger = {
      debug: (msg: string, data?: unknown) => this.emit('log', { level: 'debug', msg, data }),
      info: (msg: string, data?: unknown) => this.emit('log', { level: 'info', msg, data }),
      warn: (msg: string, data?: unknown) => this.emit('log', { level: 'warn', msg, data }),
      error: (msg: string, data?: unknown) => this.emit('log', { level: 'error', msg, data }),
    };

    const mcpServer = createMCPServer(
      {
        name: 'Claude-Flow MCP Server V3',
        version: '3.0.0',
        transport: this.options.transport as 'http' | 'websocket',
        host: this.options.host,
        port: this.options.port,
        enableMetrics: true,
        enableCaching: true,
      },
      logger
    );

    await mcpServer.start();

    // Store reference for stopping
    (this as any)._mcpServer = mcpServer;
  }

  /**
   * Wait for server to be ready
   */
  private async waitForReady(timeout = 10000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const health = await this.checkHealth();
      if (health.healthy) {
        return;
      }
      await this.sleep(100);
    }

    // For stdio, just check if process is running
    if (this.options.transport === 'stdio' && this.process && !this.process.killed) {
      return;
    }

    throw new Error('Server failed to start within timeout');
  }

  /**
   * Wait for process to exit
   */
  private async waitForExit(timeout: number): Promise<void> {
    if (!this.process) return;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, timeout);

      this.process!.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.checkHealth();
        this.emit('health', health);

        if (!health.healthy) {
          this.emit('unhealthy', health);
        }
      } catch (error) {
        this.emit('health-error', error);
      }
    }, 30000);
  }

  /**
   * Write PID file
   */
  private async writePidFile(): Promise<void> {
    const pid = this.process?.pid || process.pid;
    await fs.promises.writeFile(this.options.pidFile, String(pid), 'utf8');
  }

  /**
   * Read PID file
   */
  private async readPidFile(): Promise<number | null> {
    try {
      const content = await fs.promises.readFile(this.options.pidFile, 'utf8');
      const pid = parseInt(content.trim(), 10);
      return isNaN(pid) ? null : pid;
    } catch {
      return null;
    }
  }

  /**
   * Remove PID file
   */
  private async removePidFile(): Promise<void> {
    try {
      await fs.promises.unlink(this.options.pidFile);
    } catch {
      // Ignore errors
    }
  }

  /**
   * Check if process is running
   */
  private isProcessRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Make HTTP request
   */
  private async httpRequest(
    url: string,
    method: string,
    timeout: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const http = require('http');

      const req = http.request(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname,
          method,
          timeout,
        },
        (res: any) => {
          let data = '';
          res.on('data', (chunk: string) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve({ status: res.statusCode === 200 ? 'ok' : 'error' });
            }
          });
        }
      );

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create MCP server manager
 */
export function createMCPServerManager(
  options?: MCPServerOptions
): MCPServerManager {
  return new MCPServerManager(options);
}

/**
 * Singleton server manager instance
 */
let serverManager: MCPServerManager | null = null;

/**
 * Get or create server manager singleton
 */
export function getServerManager(
  options?: MCPServerOptions
): MCPServerManager {
  if (!serverManager) {
    serverManager = new MCPServerManager(options);
  }
  return serverManager;
}

/**
 * Quick start MCP server
 */
export async function startMCPServer(
  options?: MCPServerOptions
): Promise<MCPServerStatus> {
  const manager = getServerManager(options);
  return await manager.start();
}

/**
 * Quick stop MCP server
 */
export async function stopMCPServer(force = false): Promise<void> {
  if (serverManager) {
    await serverManager.stop(force);
  }
}

/**
 * Get MCP server status
 */
export async function getMCPServerStatus(): Promise<MCPServerStatus> {
  const manager = getServerManager();
  return await manager.getStatus();
}

export default MCPServerManager;
