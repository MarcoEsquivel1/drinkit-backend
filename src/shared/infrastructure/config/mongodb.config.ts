export const mongoConfiguration = (): MongoConfigurationType => ({
  MONGO_USERNAME: process.env.MONGO_USERNAME || 'user',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'pass',
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'audit',
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
  MONGO_PORT: parseInt(process.env.MONGO_PORT || '27017', 10),
});

type MongoConfigurationType = {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DATABASE: string;
  MONGO_HOST: string;
  MONGO_PORT: number;
};
