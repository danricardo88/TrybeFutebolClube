import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import Match from '../database/models/MatchMod';
import { Response } from 'superagent';
import { IMatch, IMatchDB, IMatchInfo } from '../interfaces/IMatch';
import { matchMock, newMatch, invalidMatch, newMatchResp } from './mocks/matchMock';
import { StatusCodes } from 'http-status-codes';


chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('"/matches" testes de integração de rota', () => {
  let chaiHttpResp: Response;

  describe('GET', () => {
    afterEach(() => {
      (Match.findAll as sinon.SinonStub).restore();
    });
    it('Retorna todas as match', async () => {
      sinon.stub(Match, 'findAll').resolves(matchMock as IMatchDB[]);
      chaiHttpResp = await chai.request(app).get('/matches');

      expect(chaiHttpResp.status).to.be.equal(200);
      expect(chaiHttpResp.body).to.deep.equal(matchMock);
    });

    it('Retorna match que estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[1]] as IMatchDB[]);
      chaiHttpResp = await chai.request(app).get('/matches?inProgress=true');

      expect(chaiHttpResp.status).to.be.equal(200);
      expect(chaiHttpResp.body).to.deep.equal([matchMock[1]]);
    });

    it('Retorna match que não estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[0]] as IMatchDB[]);
      chaiHttpResp = await chai.request(app).get('/matches?inProgress=false');

      expect(chaiHttpResp.status).to.be.equal(200);
      expect(chaiHttpResp.body).to.deep.equal([matchMock[0]]);
    });
  });

  describe('POST', () => {
    describe('With sucess', () => {
      it('Creates a new match', async () => {
        (jwt.verify as sinon.SinonStub).restore();

        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon
          .stub(Match, 'create')
          .resolves(newMatchResp as IMatchDB);

        chaiHttpResp = await chai
          .request(app)
          .post('/matches')
          .send(newMatch)
          .auth('token', { type: 'bearer' });
        expect(chaiHttpResp.status).to.be.equal(201);
        expect(chaiHttpResp.body).to.deep.equal(newMatchResp);
      });
    });

    describe('It fails', () => {
      it('Fails if the homeTeam is equal to awayTeam', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        chaiHttpResp = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[0])
          .auth('token', { type: 'bearer' });
        expect(chaiHttpResp.status).to.be.equal(422);
        expect(chaiHttpResp.body).to.deep.equal({
          message: 'It is not possible to create a match with two equal teams',
        });
      });
      it('Fails if a team does not exists', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        chaiHttpResp = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[1])
          .auth('token', { type: 'bearer' });
        expect(chaiHttpResp.status).to.be.equal(404);
        expect(chaiHttpResp.body).to.deep.equal({
          message: 'There is no team with such id!',
        });
      });
      it('Fails if the token is invalid', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        chaiHttpResp = await chai
          .request(app)
          .post('/matches')
          .send(newMatch);
        expect(chaiHttpResp.status).to.be.equal(401);
        expect(chaiHttpResp.body).to.deep.equal({
          message: 'Token must be a valid token',
        });
      });
    });
  });
});

describe('"/matches/:id/finish" route integration tests', () => {
  let chaiHttpResp: Response;

  describe('PATCH', () => {
    afterEach(() => {
      (Match.update as sinon.SinonStub).restore();
    });

    it('Finishs a match by his id', async () => {
      sinon.stub(Match, 'update').resolves([1]);

      chaiHttpResp = await chai.request(app).patch('/matches/1/finish');

      expect(chaiHttpResp.status).to.be.equal(StatusCodes.OK);
      expect(chaiHttpResp.body).to.deep.equal({ message: 'Finished' });
    });

    it('Fails if the update goes wrong', async () => {
      sinon.stub(Match, 'update').resolves([-1]);

      chaiHttpResp = await chai.request(app).patch('/matches/1/finish');

      expect(chaiHttpResp.status).to.be.equal(StatusCodes.OK);
      expect(chaiHttpResp.body).to.deep.equal({
        message: 'Update unsuccessful',
      });
    });
  });
});
