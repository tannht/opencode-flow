/**
 * Pattern Store Module
 * Decentralized pattern marketplace using IPFS
 */

// Types
export type {
  PatternEntry,
  PatternAuthor,
  PatternCategory,
  PatternRegistry,
  SearchOptions,
  SearchResult,
  PublishOptions,
  PublishResult,
  DownloadOptions,
  DownloadResult,
  KnownRegistry,
  StoreConfig,
  RatingSubmission,
} from './types.js';

// Registry
export {
  REGISTRY_VERSION,
  BOOTSTRAP_REGISTRIES,
  DEFAULT_STORE_CONFIG,
  createRegistry,
  getDefaultCategories,
  addPatternToRegistry,
  removePatternFromRegistry,
  serializeRegistry,
  deserializeRegistry,
  signRegistry,
  verifyRegistrySignature,
  mergeRegistries,
  generatePatternId,
} from './registry.js';

// Discovery
export type { DiscoveryResult, IPNSResolution } from './discovery.js';
export { PatternDiscovery, createDiscoveryService } from './discovery.js';

// Search
export {
  searchPatterns,
  getFeaturedPatterns,
  getTrendingPatterns,
  getNewestPatterns,
  getPatternById,
  getPatternByName,
  getPatternsByAuthor,
  getPatternsByCategory,
  getSimilarPatterns,
  getCategoryStats,
  getTagCloud,
  getSearchSuggestions,
} from './search.js';

// Download
export type { DownloadProgressCallback } from './download.js';
export {
  PatternDownloader,
  batchDownload,
  createDownloader,
} from './download.js';

// Publish
export type { ContributionRequest } from './publish.js';
export {
  PatternPublisher,
  submitContribution,
  checkContributionStatus,
  createPublisher,
  quickPublish,
} from './publish.js';

/**
 * Pattern Store - High-level API
 */
export class PatternStore {
  private discovery: import('./discovery.js').PatternDiscovery;
  private downloader: import('./download.js').PatternDownloader;
  private publisher: import('./publish.js').PatternPublisher;
  private registry: PatternRegistry | null = null;

  constructor(config: Partial<import('./types.js').StoreConfig> = {}) {
    // Lazy imports to avoid circular dependencies
    const { PatternDiscovery } = require('./discovery.js');
    const { PatternDownloader } = require('./download.js');
    const { PatternPublisher } = require('./publish.js');

    this.discovery = new PatternDiscovery(config);
    this.downloader = new PatternDownloader(config);
    this.publisher = new PatternPublisher(config);
  }

  /**
   * Initialize store and load registry
   */
  async initialize(registryName?: string): Promise<boolean> {
    const result = await this.discovery.discoverRegistry(registryName);
    if (result.success && result.registry) {
      this.registry = result.registry;
      return true;
    }
    return false;
  }

  /**
   * Search patterns
   */
  search(options: import('./types.js').SearchOptions = {}): import('./types.js').SearchResult {
    if (!this.registry) {
      throw new Error('Store not initialized. Call initialize() first.');
    }
    const { searchPatterns } = require('./search.js');
    return searchPatterns(this.registry, options);
  }

  /**
   * Get pattern by ID
   */
  getPattern(patternId: string): import('./types.js').PatternEntry | undefined {
    if (!this.registry) {
      throw new Error('Store not initialized. Call initialize() first.');
    }
    return this.registry.patterns.find(p => p.id === patternId);
  }

  /**
   * Download pattern
   */
  async download(
    patternId: string,
    options: import('./types.js').DownloadOptions = {}
  ): Promise<import('./types.js').DownloadResult> {
    const pattern = this.getPattern(patternId);
    if (!pattern) {
      throw new Error(`Pattern not found: ${patternId}`);
    }
    return this.downloader.downloadPattern(pattern, options);
  }

  /**
   * Publish pattern
   */
  async publish(
    cfp: import('../types.js').CFPFormat,
    options: import('./types.js').PublishOptions
  ): Promise<import('./types.js').PublishResult> {
    return this.publisher.publishPattern(cfp, options);
  }

  /**
   * Get featured patterns
   */
  getFeatured(): import('./types.js').PatternEntry[] {
    if (!this.registry) return [];
    const { getFeaturedPatterns } = require('./search.js');
    return getFeaturedPatterns(this.registry);
  }

  /**
   * Get trending patterns
   */
  getTrending(): import('./types.js').PatternEntry[] {
    if (!this.registry) return [];
    const { getTrendingPatterns } = require('./search.js');
    return getTrendingPatterns(this.registry);
  }

  /**
   * Get newest patterns
   */
  getNewest(): import('./types.js').PatternEntry[] {
    if (!this.registry) return [];
    const { getNewestPatterns } = require('./search.js');
    return getNewestPatterns(this.registry);
  }

  /**
   * Get categories
   */
  getCategories(): import('./types.js').PatternCategory[] {
    if (!this.registry) return [];
    return this.registry.categories;
  }

  /**
   * Get available registries
   */
  getRegistries(): import('./types.js').KnownRegistry[] {
    return this.discovery.listRegistries();
  }

  /**
   * Refresh registry
   */
  async refresh(): Promise<boolean> {
    this.discovery.clearCache();
    return this.initialize();
  }

  /**
   * Get store statistics
   */
  getStats(): {
    totalPatterns: number;
    totalDownloads: number;
    totalAuthors: number;
    categories: number;
  } {
    if (!this.registry) {
      return { totalPatterns: 0, totalDownloads: 0, totalAuthors: 0, categories: 0 };
    }
    return {
      totalPatterns: this.registry.totalPatterns,
      totalDownloads: this.registry.totalDownloads,
      totalAuthors: this.registry.totalAuthors,
      categories: this.registry.categories.length,
    };
  }
}

/**
 * Create pattern store instance
 */
export function createPatternStore(
  config?: Partial<import('./types.js').StoreConfig>
): PatternStore {
  return new PatternStore(config);
}

// Import PatternRegistry type for the class
import type { PatternRegistry } from './types.js';
