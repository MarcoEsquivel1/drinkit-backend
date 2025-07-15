import Joi from 'joi';

export const mongoValidationSchema = Joi.object({
  MONGO_USERNAME: Joi.string().empty('').default('user'),
  MONGO_PASSWORD: Joi.string().empty('').default('pass'),
  MONGO_DATABASE: Joi.string().empty('').default('audit'),
  MONGO_HOST: Joi.string().empty('').default('localhost'),
  MONGO_PORT: Joi.number().empty('').default(27017),
});
