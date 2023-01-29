import * as Joi from 'joi';

export const matchSchema = Joi.object({
  homeTeamId: Joi.number().required(),
  awayTeamId: Joi.number().required(),
  homeTeamGoals: Joi.number().min(0).required(),
  awayTeamGoals: Joi.number().min(0).required(),
});

const REQUIRED_MSG = 'All fields must be filled';
const INVALID_FIELDS_MSG = 'Incorrect email or password';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': REQUIRED_MSG,
    'string.email': INVALID_FIELDS_MSG,
    'any.required': REQUIRED_MSG,
  }),
  password: Joi.string().required().messages({
    'string.empty': REQUIRED_MSG,
    'any.required': REQUIRED_MSG,
  }),
});
