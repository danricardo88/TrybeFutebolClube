import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import Match from '../database/models/MatchMod';
import { Response } from 'superagent';
import { IMatch, INewM } from '../interfaces';
import { matchMock, newMatch, invalidMatch, newMatchResp } from './mocks/matchMock';


chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('"/matches" testes de integração de rota', () => {
  let chaiHttpResponse: Response;

  describe('GET', () => {
    afterEach(() => {
      (Match.findAll as sinon.SinonStub).restore();
    });
    it('Retorna todas as match', async () => {
      sinon.stub(Match, 'findAll').resolves(matchMock as IMatch[]);
      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchMock);
    });

    it('Retorna match que estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[1]] as IMatch[]);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal([matchMock[1]]);
    });

    it('Retorna match que não estão em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves([matchMock[0]] as IMatch[]);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal([matchMock[0]]);
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
    });

    afterEach(() => {
      (Match.create as sinon.SinonStub).restore();
      (jwt.verify as sinon.SinonStub).restore();
    });

    describe('Sucesso', () => {
      it('Cria uma nova match', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/matches')
          .send(newMatch)
          .auth('token', { type: 'bearer' });

        expect(chaiHttpResponse.status).to.be.equal(201);
        expect(chaiHttpResponse.body).to.deep.equal(newMatchResp);
      });
    });

    describe('Falhou', () => {
      it('Falha se o homeTeam for igual ao awayTeam', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[0])
          .auth('token', { type: 'bearer' });

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'Não é possível criar com duas equipes iguais',
        });
      });

      it('Falha se uma equipe não existe', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/matches')
          .send(invalidMatch[1])
          .auth('token', { type: 'bearer' });

        expect(chaiHttpResponse.status).to.be.equal(404);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'Id do time não encontrado!',
        });
      });

      it('Falha se o token for inválido', async () => {
        sinon.stub(jwt, 'verify').resolves(undefined);

        chaiHttpResponse = await chai
          .request(app)
          .post('/matches')
          .send(newMatch)
          .auth('invalidToken', { type: 'bearer' });

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'O token deve ser um token válido',
        });
      });
    });
  });
});