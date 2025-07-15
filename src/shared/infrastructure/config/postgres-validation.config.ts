import Joi from 'joi';

export const postgresValidationSchema = Joi.object({
  POSTGRES_USERNAME: Joi.string().empty('').default('user'),
  POSTGRES_PASSWORD: Joi.any().empty('').default('pass'),
  POSTGRES_NAME: Joi.string().empty('').default('dinkit'),
  POSTGRES_HOST: Joi.string().empty('').default('localhost'),
  POSTGRES_PORT: Joi.number().empty('').default(5432),
  POSTGRES_SCHEMA: Joi.string().empty('').default('public'),
  POSTGRES_USE_SSL: Joi.boolean().empty('').default(false),
});
