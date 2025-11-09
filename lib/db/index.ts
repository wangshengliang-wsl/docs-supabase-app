import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// 配置 Neon
neonConfig.fetchConnectionCache = true;

// 创建连接池
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 创建 drizzle 客户端
export const db = drizzle(pool, { schema });

export * from './schema';
