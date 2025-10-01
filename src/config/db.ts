import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { tasksTable } from '../db/schema';

const client = createClient({
    url: process.env.DATABASE_URL || 'file:database.sqlite'
});

export const db = drizzle(client, { schema: { tasksTable } });
