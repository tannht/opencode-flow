/**
 * @claude-flow/performance - Flash Attention Integration
 *
 * Integrates @ruvector/attention Flash Attention capabilities into V3 performance module.
 * Provides optimized attention mechanisms with 2.49x-7.47x speedup targets.
 *
 * Features:
 * - Flash Attention for memory-efficient processing
 * - Automatic runtime selection (NAPI/WASM/JS)
 * - Performance benchmarking and metrics
 * - Speedup tracking and validation
 */

import {
  FlashAttention,
  DotProductAttention,
  type BenchmarkResult as AttentionBenchmarkResult,
  type ArrayInput,
} from '@ruvector/attention';

// ============================================================================
// Types
// ============================================================================

export interface AttentionInput {
  query: Float32Array | number[];
  keys: Float32Array[] | number[][];
  values: Float32Array[] | number[][];
  dim?: number;
  blockSize?: number;
}

export interface AttentionOutput {
  result: Float32Array;
  runtime: 'napi' | 'wasm' | 'js';
  executionTimeMs: number;
  memoryUsageBytes?: number;
}

export interface BenchmarkResult {
  flashAttention: {
    averageTimeMs: number;
    opsPerSecond: number;
    memoryUsageBytes?: number;
  };
  baseline: {
    averageTimeMs: number;
    opsPerSecond: number;
    memoryUsageBytes?: number;
  };
  speedup: number;
  meetsTarget: boolean; // true if speedup >= 2.49x
  timestamp: Date;
}

export interface PerformanceMetrics {
  totalOperations: number;
  averageSpeedup: number;
  peakSpeedup: number;
  averageExecutionTimeMs: number;
  totalMemorySavedBytes: number;
  successRate: number; // % of operations meeting target
  // Memory tracking metrics
  baselineMemoryBytes: number;
  optimizedMemoryBytes: number;
  memorySavedBytes: number;
  memorySavedPercent: number;
  peakMemoryBytes: number;
}

// ============================================================================
// Flash Attention Optimizer
// ============================================================================

export class FlashAttentionOptimizer {
  private flashAttention: FlashAttention;
  private baselineAttention: DotProductAttention;
  private metrics: {
    operations: number;
    totalSpeedup: number;
    peakSpeedup: number;
    totalExecutionTime: number;
    successfulOperations: number;
  };

  constructor(
    private readonly dim: number = 512,
    private readonly blockSize: number = 64
  ) {
    this.flashAttention = new FlashAttention(dim, blockSize);
    this.baselineAttention = new DotProductAttention(dim);
    this.metrics = {
      operations: 0,
      totalSpeedup: 0,
      peakSpeedup: 0,
      totalExecutionTime: 0,
      successfulOperations: 0,
    };
  }

  /**
   * Optimize attention computation using Flash Attention
   * @param input - Query, keys, and values for attention computation
   * @returns Optimized attention output with performance metrics
   */
  optimize(input: AttentionInput): AttentionOutput {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    // Convert inputs if needed
    const query = this.ensureFloat32Array(input.query);
    const keys = input.keys.map(k => this.ensureFloat32Array(k));
    const values = input.values.map(v => this.ensureFloat32Array(v));

    // Use synchronous Flash Attention with raw Float32Arrays
    const result = this.flashAttention.computeRaw(query, keys, values);

    const executionTimeMs = performance.now() - startTime;
    const endMemory = this.getMemoryUsage();
    const memoryUsageBytes = endMemory - startMemory;

    // Update metrics
    this.metrics.operations++;
    this.metrics.totalExecutionTime += executionTimeMs;

    return {
      result,
      runtime: this.detectRuntime(),
      executionTimeMs,
      memoryUsageBytes: memoryUsageBytes > 0 ? memoryUsageBytes : undefined,
    };
  }

  /**
   * Benchmark Flash Attention vs baseline attention
   * @returns Comprehensive benchmark results with speedup metrics
   */
  benchmark(): BenchmarkResult {
    const dim = this.dim;
    const numKeys = 100;
    const iterations = 1000;

    // Create test data
    const query = new Float32Array(dim);
    const keys = Array.from({ length: numKeys }, () => new Float32Array(dim));
    const values = Array.from({ length: numKeys }, () => new Float32Array(dim));

    // Fill with random data
    for (let i = 0; i < dim; i++) {
      query[i] = Math.random();
    }
    for (let i = 0; i < numKeys; i++) {
      for (let j = 0; j < dim; j++) {
        keys[i][j] = Math.random();
        values[i][j] = Math.random();
      }
    }

    // Benchmark Flash Attention
    const flashStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.flashAttention.computeRaw(query, keys, values);
    }
    const flashEnd = performance.now();
    const flashTimeMs = flashEnd - flashStart;
    const flashAvgMs = flashTimeMs / iterations;

    // Benchmark baseline (DotProduct)
    const baselineStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.baselineAttention.computeRaw(query, keys, values);
    }
    const baselineEnd = performance.now();
    const baselineTimeMs = baselineEnd - baselineStart;
    const baselineAvgMs = baselineTimeMs / iterations;

    const speedup = baselineAvgMs / flashAvgMs;
    const meetsTarget = speedup >= 2.49; // Minimum target: 2.49x

    // Update peak speedup
    if (speedup > this.metrics.peakSpeedup) {
      this.metrics.peakSpeedup = speedup;
    }

    this.metrics.totalSpeedup += speedup;
    if (meetsTarget) {
      this.metrics.successfulOperations++;
    }

    return {
      flashAttention: {
        averageTimeMs: flashAvgMs,
        opsPerSecond: 1000 / flashAvgMs,
        memoryUsageBytes: undefined,
      },
      baseline: {
        averageTimeMs: baselineAvgMs,
        opsPerSecond: 1000 / baselineAvgMs,
        memoryUsageBytes: undefined,
      },
      speedup,
      meetsTarget,
      timestamp: new Date(),
    };
  }

  /**
   * Get current speedup factor from accumulated metrics
   * @returns Average speedup factor across all operations
   */
  getSpeedup(): number {
    if (this.metrics.operations === 0) {
      return 0;
    }
    return this.metrics.totalSpeedup / this.metrics.operations;
  }

  /**
   * Get comprehensive performance metrics
   * @returns Detailed performance statistics
   */
  getMetrics(): PerformanceMetrics {
    const avgSpeedup = this.getSpeedup();

    return {
      totalOperations: this.metrics.operations,
      averageSpeedup: avgSpeedup,
      peakSpeedup: this.metrics.peakSpeedup,
      averageExecutionTimeMs:
        this.metrics.operations > 0
          ? this.metrics.totalExecutionTime / this.metrics.operations
          : 0,
      totalMemorySavedBytes: 0, // TODO: Implement memory tracking
      successRate:
        this.metrics.operations > 0
          ? (this.metrics.successfulOperations / this.metrics.operations) * 100
          : 0,
    };
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.metrics = {
      operations: 0,
      totalSpeedup: 0,
      peakSpeedup: 0,
      totalExecutionTime: 0,
      successfulOperations: 0,
    };
  }

  /**
   * Ensure input is Float32Array for optimal performance
   */
  private ensureFloat32Array(input: ArrayInput): Float32Array {
    if (input instanceof Float32Array) {
      return input;
    }
    return new Float32Array(input);
  }

  /**
   * Detect which runtime is being used
   */
  private detectRuntime(): 'napi' | 'wasm' | 'js' {
    // Check if NAPI bindings are available
    try {
      if (typeof process !== 'undefined' && process.versions && 'napi' in process.versions) {
        return 'napi';
      }
    } catch {
      // Not in Node.js environment
    }

    // Check for WebAssembly support
    if (typeof globalThis !== 'undefined' && 'WebAssembly' in globalThis) {
      return 'wasm';
    }

    // Fallback to pure JS
    return 'js';
  }

  /**
   * Get current memory usage in bytes
   */
  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }
}

// ============================================================================
// Convenience Factory Functions
// ============================================================================

/**
 * Create a Flash Attention optimizer with default settings
 * @param dim - Dimension of attention vectors (default: 512)
 * @param blockSize - Block size for Flash Attention (default: 64)
 * @returns Configured FlashAttentionOptimizer instance
 */
export function createFlashAttentionOptimizer(
  dim: number = 512,
  blockSize: number = 64
): FlashAttentionOptimizer {
  return new FlashAttentionOptimizer(dim, blockSize);
}

/**
 * Quick benchmark of Flash Attention performance
 * @param dim - Dimension to test (default: 512)
 * @returns Benchmark results with speedup metrics
 */
export function quickBenchmark(dim: number = 512): BenchmarkResult {
  const optimizer = createFlashAttentionOptimizer(dim);
  return optimizer.benchmark();
}

// ============================================================================
// Exports
// ============================================================================

export {
  FlashAttention,
  DotProductAttention,
  type AttentionBenchmarkResult,
};
