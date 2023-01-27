import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import Team from '../database/models/TeamsModel';
import { Response } from 'superagent';
import { teamsMock } from './mocks/teamMock';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('"/teams" testes de integração de rota', () => {


  let chaiHttpResponse: Response;

  describe('GET', () => {
    it('Retorna todas as equipes', async () => {
      sinon.stub(Team, 'findAll').resolves(teamsMock as Team[]);
      chaiHttpResponse = await chai.request(app).get('/teams');
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamsMock);
    });
  });
});

describe('"/teams/:id" testes de integração de rota', () => {
  let chaiHttpResponse: Response;

  afterEach(() => {
    (Team.findByPk as sinon.SinonStub).restore();
  })

  describe('GET', () => {
    it('Retorna uma equipe por seu Id', async () => {
      sinon.stub(Team, 'findByPk').resolves(teamsMock[0] as Team);
      chaiHttpResponse = await chai.request(app).get('/teams/1');
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamsMock[0]);
    });

    it('Falha se a equipe não existir', async () => {
      sinon.stub(Team, 'findByPk').resolves(undefined);
      chaiHttpResponse = await chai.request(app).get('/teams/1');
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamsMock[0]);
    })
  });
});