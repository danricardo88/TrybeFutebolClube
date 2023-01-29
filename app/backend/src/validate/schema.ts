import * as Joi from 'joi';

export const matchSchema = Joi.object({
  homeTeamId: Joi.number().required(),
  awayTeamId: Joi.number().required(),
  homeTeamGoals: Joi.number().min(0).required(),
  awayTeamGoals: Joi.number().min(0).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
