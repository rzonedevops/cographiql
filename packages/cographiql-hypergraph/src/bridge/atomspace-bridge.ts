/**
 * AtomSpace Bridge
 * WebSocket-based bridge to OpenCog CogServer
 */

import WebSocket from 'ws';
import {
  Atom,
  AtomQuery,
  PatternMatchQuery,
  TruthValue,
  AttentionValue,
  CogServerConfig,
  WebSocketMessage,
  MessageType,
} from '../types/cognitive-types';

export class AtomSpaceBridge {
  private ws: WebSocket | null = null;
  private config: CogServerConfig;
  private connected: boolean = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageId: number = 0;

  constructor(config: CogServerConfig) {
    this.config = config;
  }

  /**
   * Connect to CogServer
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.config.protocol}://${this.config.host}:${this.config.port}`;
      
      try {
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
          console.log(`Connected to CogServer at ${url}`);
          this.connected = true;
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data);
        });

        this.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          if (!this.connected) {
            reject(error);
          }
        });

        this.ws.on('close', () => {
          console.log('WebSocket connection closed');
          this.connected = false;
          
          if (this.config.reconnect) {
            this.scheduleReconnect();
          }
        });

        // Set timeout for connection
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('Connection timeout'));
          }
        }, this.config.timeout);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from CogServer
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.connected = false;
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = null;
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(data: WebSocket.Data): void {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());

      // Handle response to specific request
      if (message.type === MessageType.RESPONSE) {
        const handler = this.messageHandlers.get(message.id);
        if (handler) {
          handler(message.payload);
          this.messageHandlers.delete(message.id);
        }
      }

      // Handle subscription updates
      if (message.type === MessageType.ATTENTION_UPDATE ||
          message.type === MessageType.SYNERGY_UPDATE ||
          message.type === MessageType.ATOM_CREATED ||
          message.type === MessageType.ATOM_UPDATED) {
        const subscribers = this.subscriptions.get(message.type);
        if (subscribers) {
          subscribers.forEach(callback => callback(message.payload));
        }
      }

      // Handle errors
      if (message.type === MessageType.ERROR) {
        console.error('CogServer error:', message.payload);
        const handler = this.messageHandlers.get(message.id);
        if (handler) {
          handler({ error: message.payload });
          this.messageHandlers.delete(message.id);
        }
      }

    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  /**
   * Send message to CogServer
   */
  private async sendMessage(type: MessageType, payload: any): Promise<any> {
    if (!this.connected || !this.ws) {
      throw new Error('Not connected to CogServer');
    }

    return new Promise((resolve, reject) => {
      const id = `msg_${this.messageId++}`;
      const message: WebSocketMessage = {
        type,
        id,
        payload,
        timestamp: Date.now(),
      };

      // Set up response handler
      this.messageHandlers.set(id, (data) => {
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      });

      // Send message
      this.ws!.send(JSON.stringify(message));

      // Set timeout
      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          this.messageHandlers.delete(id);
          reject(new Error('Request timeout'));
        }
      }, this.config.timeout);
    });
  }

  /**
   * Get atom by ID
   */
  async getAtom(id: string): Promise<Atom> {
    const result = await this.sendMessage(MessageType.QUERY, {
      operation: 'getAtom',
      id,
    });
    return result.atom;
  }

  /**
   * Query atoms with filters
   */
  async queryAtoms(query: AtomQuery, limit: number = 100): Promise<Atom[]> {
    const result = await this.sendMessage(MessageType.QUERY, {
      operation: 'queryAtoms',
      query,
      limit,
    });
    return result.atoms;
  }

  /**
   * Pattern matching
   */
  async patternMatch(input: PatternMatchQuery): Promise<{
    matches: Atom[];
    count: number;
    executionTime: number;
  }> {
    const startTime = Date.now();
    const result = await this.sendMessage(MessageType.QUERY, {
      operation: 'patternMatch',
      pattern: input.pattern,
      distributed: input.distributed,
    });
    const executionTime = Date.now() - startTime;

    return {
      matches: result.matches,
      count: result.matches.length,
      executionTime,
    };
  }

  /**
   * Create new atom
   */
  async createAtom(args: {
    type: string;
    name?: string;
    outgoing?: string[];
  }): Promise<Atom> {
    const result = await this.sendMessage(MessageType.MUTATION, {
      operation: 'createAtom',
      ...args,
    });
    return result.atom;
  }

  /**
   * Update truth value
   */
  async updateTruthValue(id: string, truthValue: TruthValue): Promise<Atom> {
    const result = await this.sendMessage(MessageType.MUTATION, {
      operation: 'updateTruthValue',
      id,
      truthValue,
    });
    return result.atom;
  }

  /**
   * Allocate attention
   */
  async allocateAttention(id: string, attentionValue: Partial<AttentionValue>): Promise<Atom> {
    const result = await this.sendMessage(MessageType.MUTATION, {
      operation: 'allocateAttention',
      id,
      attentionValue,
    });
    return result.atom;
  }

  /**
   * Subscribe to attention updates
   */
  async subscribeToAttention(minSTI: number = 0): Promise<AsyncIterator<Atom>> {
    await this.sendMessage(MessageType.SUBSCRIPTION, {
      operation: 'subscribeAttention',
      minSTI,
    });

    const callbacks = this.subscriptions.get(MessageType.ATTENTION_UPDATE) || new Set();
    this.subscriptions.set(MessageType.ATTENTION_UPDATE, callbacks);

    // Return async iterator for GraphQL subscriptions
    return {
      next: () => {
        return new Promise<IteratorResult<Atom>>((resolve) => {
          const callback = (atom: Atom) => {
            callbacks.delete(callback);
            resolve({ value: atom, done: false });
          };
          callbacks.add(callback);
        });
      },
      return: async () => {
        return { value: undefined, done: true };
      },
      throw: async (error: any) => {
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  /**
   * Subscribe to atom creation
   */
  async subscribeToCreation(): Promise<AsyncIterator<Atom>> {
    await this.sendMessage(MessageType.SUBSCRIPTION, {
      operation: 'subscribeCreation',
    });

    const callbacks = this.subscriptions.get(MessageType.ATOM_CREATED) || new Set();
    this.subscriptions.set(MessageType.ATOM_CREATED, callbacks);

    return {
      next: () => {
        return new Promise<IteratorResult<Atom>>((resolve) => {
          const callback = (atom: Atom) => {
            callbacks.delete(callback);
            resolve({ value: atom, done: false });
          };
          callbacks.add(callback);
        });
      },
      return: async () => {
        return { value: undefined, done: true };
      },
      throw: async (error: any) => {
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  /**
   * Execute Scheme code on CogServer
   */
  async executeScheme(code: string): Promise<any> {
    const result = await this.sendMessage(MessageType.QUERY, {
      operation: 'executeScheme',
      code,
    });
    return result.output;
  }

  /**
   * Get AtomSpace statistics
   */
  async getStatistics(): Promise<{
    atomCount: number;
    nodeCount: number;
    linkCount: number;
    avgTruthValue: number;
    avgAttention: number;
  }> {
    const result = await this.sendMessage(MessageType.QUERY, {
      operation: 'getStatistics',
    });
    return result.statistics;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Distributed AtomSpace Bridge
 * Manages connections to multiple CogServers
 */
export class DistributedAtomSpaceBridge {
  private bridges: Map<string, AtomSpaceBridge> = new Map();
  private shardCount: number;

  constructor(configs: Map<string, CogServerConfig>) {
    this.shardCount = configs.size;
    
    configs.forEach((config, serverId) => {
      this.bridges.set(serverId, new AtomSpaceBridge(config));
    });
  }

  /**
   * Connect to all CogServers
   */
  async connectAll(): Promise<void> {
    const promises = Array.from(this.bridges.values()).map(bridge => bridge.connect());
    await Promise.all(promises);
  }

  /**
   * Disconnect from all CogServers
   */
  disconnectAll(): void {
    this.bridges.forEach(bridge => bridge.disconnect());
  }

  /**
   * Execute distributed query
   */
  async distributedQuery(query: any): Promise<any[]> {
    const promises = Array.from(this.bridges.values()).map(bridge => 
      bridge.queryAtoms(query)
    );
    const results = await Promise.all(promises);
    
    // Merge and deduplicate results
    const merged = new Map<string, Atom>();
    results.flat().forEach(atom => {
      merged.set(atom.id, atom);
    });
    
    return Array.from(merged.values());
  }

  /**
   * Get bridge for specific shard
   */
  getBridge(serverId: string): AtomSpaceBridge | undefined {
    return this.bridges.get(serverId);
  }

  /**
   * Get shard count
   */
  getShardCount(): number {
    return this.shardCount;
  }
}
