import postgres from 'postgres';

// Verifica se a URL do banco está presente
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada no arquivo .env.local');
}

// Configura o cliente do Neon
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  // Otimização para Next.js: mantém a conexão viva em desenvolvimento
  transform: {
    ...postgres.camel,
    undefined: null
  }
});

export { sql };