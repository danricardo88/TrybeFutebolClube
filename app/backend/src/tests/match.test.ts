import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import Match from '../database/models/MatchMod';
import { Response } from 'superagent';
import { IMatch, IMatchDB, IMatchInfo } from '../interfaces/IMatch';
import { matchMock, newMatch, invalidMatch, newMatchResp, updateMatch, missingField } from './mocks/matchMock';
import { StatusCodes } from 'http-status-codes';


chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('"/matches" testes de integração de rota', () => {
  let chaiHttpRes: Response;

  describe('GET', () => {
    afterEach(() => {
      (Match.findAll as sinon.SinonStub).restore();
    });
    it('Retorna todas as match', async () => {
      sinon.stub(Match, 'findAll').resolves(matchMock as IMatchDB[]);
      chaiHttpRes = await chai.request(app).get('/matches');

      expect(chaiHttpRes.status).to.be.equal(200);
      expect(chaiHttpRes.body).to.deep.equal(matchMock);
    });

    it('Retorna match que estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[1]] as IMatchDB[]);
      chaiHttpRes = await chai.request(app).get('/matches?inProgress=true');

      expect(chaiHttpRes.status).to.be.equal(200);
      expect(chaiHttpRes.body).to.deep.equal([matchMock[1]]);
    });

    it('Retorna match que não estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[0]] as IMatchDB[]);
      chaiHttpRes = await chai.request(app).get('/matches?inProgress=false');

      expect(chaiHttpRes.status).to.be.equal(200);
      expect(chaiHttpRes.body).to.deep.equal([matchMock[0]]);
    });
  });

  describe('POST', () => {
    describe('Sucesso', () => {
      it('Cria uma nova correspondência', async () => {
        (jwt.verify as sinon.SinonStub).restore();

        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon
          .stub(Match, 'create')
          .resolves(newMatchResp as IMatchDB);

        chaiHttpRes = await chai
          .request(app)
          .post('/matches')
          .send(newMatch)
          .auth('token', { type: 'bearer' });
        expect(chaiHttpRes.status).to.be.equal(201);
        expect(chaiHttpRes.body).to.deep.equal(newMatchResp);
      });
    });

    describe('Falhouuu', () => {
      it('Falha se o homeTeamId for igual ao awayTeamId', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        chaiHttpRes = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[0])
          .auth('token', { type: 'bearer' });
        expect(chaiHttpRes.status).to.be.equal(422);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'It is not possible to create a match with two equal teams',
        });
      });
      it('Falha se equipe não existe', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        chaiHttpRes = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[1])
          .auth('token', { type: 'bearer' });
        expect(chaiHttpRes.status).to.be.equal(404);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'There is no team with such id!',
        });
      });
      it('Falha se o token for inválido', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        chaiHttpRes = await chai
          .request(app)
          .post('/matches')
          .send(newMatch);
        expect(chaiHttpRes.status).to.be.equal(401);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'Token must be a valid token',
        });
      });
      it('Falha se o corpo da requisição estiver faltando campos', async () => {
        (jwt.verify as sinon.SinonStub).restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });

        chaiHttpRes = await chai
          .request(app)
          .post('/matches')
          .send(missingField)
          .auth('token', { type: 'bearer' });

        expect(chaiHttpRes.status).to.be.equal(400);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'All fields must be filled',
        });
      });
    });
  });
});

describe('"/matches/:id/" testes de integração de rota', () => {
  let chaiHttpRes: Response;

  describe('PATCH', () => {
    afterEach(() => {(Match.update as sinon.SinonStub).restore();});

      describe('/matches/:id/', () => {
        it('Edita uma correspondência com sucesso', async () => {
        sinon.stub(Match, 'update').resolves([1]);
        chaiHttpRes = await chai.request(app).patch('/matches/1/').send(updateMatch);

        expect(chaiHttpRes.status).to.be.equal(StatusCodes.OK);
        expect(chaiHttpRes.body).to.deep.equal({ message: 'Successfully updated!'});
      });

      it('Falha se a atualização der errado', async () => {
        sinon.stub(Match, 'update').resolves([-1]);

        chaiHttpRes = await chai.request(app).patch('/matches/1/');

        expect(chaiHttpRes.status).to.be.equal(StatusCodes.NOT_FOUND);
        expect(chaiHttpRes.body).to.deep.equal({message: 'Update unsuccessful' });
      });

      describe('/matches/:id/finish', () => {
        it('Finishs a match by his id', async () => {
          sinon.stub(Match, 'update').resolves([1]);

          chaiHttpRes = await chai.request(app).patch('/matches/1/finish');

          expect(chaiHttpRes.status).to.be.equal(StatusCodes.OK);
          expect(chaiHttpRes.body).to.deep.equal({ message: 'Finished' });
        });

        it('Fails if the update goes wrong', async () => {
          sinon.stub(Match, 'update').resolves([-1]);
          chaiHttpRes = await chai.request(app).patch('/matches/1/finish');

          expect(chaiHttpRes.status).to.be.equal(StatusCodes.NOT_FOUND);
          expect(chaiHttpRes.body).to.deep.equal({ message: 'Update unsuccessful' });
        });
      });
    });
  });
});