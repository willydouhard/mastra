import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PostgresStore } from './index';
import { TABLE_MESSAGES, TABLE_THREADS, TABLE_RESOURCES } from '@mastra/core/storage';

describe('PostgresStore tableMap', () => {
  let store: PostgresStore;

  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mastra_test';

  beforeAll(async () => {
    store = new PostgresStore({
      connectionString,
      tableMap: {
        [TABLE_MESSAGES]: 'chat',
        [TABLE_THREADS]: 'conversation',
        [TABLE_RESOURCES]: 'user',
      },
    });
    await store.init();
  });

  afterAll(async () => {
    await store.close();
  });

  it('should create tables with custom names', async () => {
    // Test that tables are created with the custom names
    const hasColumn = await store.stores.operations.hasColumn('chat', 'id');
    expect(hasColumn).toBe(true);
  });

  it('should use custom table names in operations', () => {
    // Check that the tableMap is set correctly
    expect(store.stores.operations.tableMap[TABLE_MESSAGES]).toBe('chat');
    expect(store.stores.operations.tableMap[TABLE_THREADS]).toBe('conversation');
    expect(store.stores.operations.tableMap[TABLE_RESOURCES]).toBe('user');
  });

  it('should resolve table names correctly', () => {
    const resolvedMessages = store.stores.operations.resolveTableName(TABLE_MESSAGES);
    expect(resolvedMessages).toBe('"chat"');

    const resolvedThreads = store.stores.operations.resolveTableName(TABLE_THREADS);
    expect(resolvedThreads).toBe('"conversation"');

    const resolvedResources = store.stores.operations.resolveTableName(TABLE_RESOURCES);
    expect(resolvedResources).toBe('"user"');
  });
});
