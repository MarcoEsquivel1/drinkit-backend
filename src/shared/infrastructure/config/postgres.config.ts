export const postgresConfiguration = (): PostgresConfigurationType => ({
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME || 'user',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'pass',
  POSTGRES_NAME: process.env.POSTGRES_NAME || 'dinkit',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  POSTGRES_SCHEMA: process.env.POSTGRES_SCHEMA || 'public',
  POSTGRES_USE_SSL: process.env.POSTGRES_USE_SSL === 'true',
});

type PostgresConfigurationType = {
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_NAME: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_SCHEMA: string;
  POSTGRES_USE_SSL: boolean;
};
