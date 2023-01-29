import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import TeamsMod from '../database/models/TeamsMod';
import { Response } from 'superagent';
import { teamsMock } from './mocks/teamMock';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('"/teams" testes de integração de rota', () => {


  let chaiHttpRes: Response;

  describe('GET', () => {
    it('Retorna todas as equipes', async () => {
      sinon.stub(TeamsMod, 'findAll').resolves(teamsMock as TeamsMod[]);
      chaiHttpRes = await chai.request(app).get('/teams');
      expect(chaiHttpRes.status).to.be.equal(200);
      expect(chaiHttpRes.body).to.deep.equal(teamsMock);
    });
  });
});

describe('"/teams/:id" testes de integração de rota', () => {
  let chaiHttpRes: Response;

  afterEach(() => {
    (TeamsMod.findByPk as sinon.SinonStub).restore();
  })

  describe('GET', () => {
    it('Retorna uma equipe por seu Id', async () => {
      sinon.stub(TeamsMod, 'findByPk').resolves(teamsMock[0] as TeamsMod);
      chaiHttpRes = await chai.request(app).get('/teams/1');
      expect(chaiHttpRes.status).to.be.equal(200);
      expect(chaiHttpRes.body).to.deep.equal(teamsMock[0]);
    });

    it('Falha se a equipe não existir', async () => {
      sinon.stub(TeamsMod, 'findByPk').resolves(undefined);
      chaiHttpRes = await chai.request(app).get('/teams/1');
      expect(chaiHttpRes.status).to.be.equal(404);
      expect(chaiHttpRes.body).to.deep.equal({
        message: 'There is no team with such id!',
      });
    });
  });
});