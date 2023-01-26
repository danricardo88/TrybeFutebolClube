import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'superagent';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import User from '../database/models/UserMod';
import { invalidLogins, loginMock, userMock } from './mocks/userMock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('"/login" testes de integração de rota', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  describe('POST', () => {
    describe('sucesso', () => {
      it('Login com sucesso', async () => {
        sinon.stub(bcryptjs, 'compare').resolves(true);
        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send(loginMock);

        expect(chaiHttpResponse.status).to.be.equal(200);
        (bcryptjs.compare as sinon.SinonStub).restore();
      });
    });

    describe('It fails', () => {
      it('Falha se o e-mail não for passado', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[0]);

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'Todos os campos devem ser preenchidos',
        });
      });

      it('Falha se a senha não for passada', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[1]);

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'Todos os campos devem ser preenchidos',
        });
      });

      it('Falha se o e-mail for inválido', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[2]);

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'senha ou email incorreto',
        });
      });

      it('Falha se a senha for inválida', async () => {
        sinon.stub(bcryptjs, 'compare').resolves(false);
        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send({ ...loginMock, password: 'coxinha' });

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.deep.equal({
          message: 'E-mail ou senha incorreta',
        });
        (bcryptjs.compare as sinon.SinonStub).restore();
      });
    });
  });
});

describe('"/login/validate" integração de rota', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(jsonwebtoken, 'verify').resolves({ data: 'OK' });
    sinon.stub(User, 'findOne').resolves(userMock as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  describe('GET', () => {
    it('Retorna a função do usuário logado', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login/verify')
        .auth('token', { type: 'bearer' });

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal({ role: userMock.role });
    });
  });
});