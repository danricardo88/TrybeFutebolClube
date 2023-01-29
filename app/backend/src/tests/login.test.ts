import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'superagent';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import Users from '../database/models/UserMod';
import {
  Token,
  invalidLogins,
  loginMock,
  userMock,
} from './mocks/userMock';
import { StatusCodes } from 'http-status-codes';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('"/login" route integration tests', () => {
  let chaiHttpRes: Response;

  describe('POST', () => {
    afterEach(() => {
      (Users.findOne as sinon.SinonStub).restore();
      (bcryptjs.compare as sinon.SinonStub).restore();
    });

    describe('With sucess', () => {
      it('Login successfully', async () => {
        sinon.stub(Users, 'findOne').resolves(userMock as Users);
        sinon.stub(jsonwebtoken, 'sign').resolves('generatedToken');
        sinon.stub(bcryptjs, 'compare').resolves(true);

        chaiHttpRes = await chai
          .request(app)
          .post('/login')
          .send(loginMock);

        expect(chaiHttpRes.status).to.be.equal(StatusCodes.OK);
        expect(chaiHttpRes.body).to.deep.equal({
          token: 'generatedToken',
        });

        (jsonwebtoken.sign as sinon.SinonStub).restore();
      });
    });

    describe('With failure', () => {
      beforeEach(async () => {
        sinon.stub(Users, 'findOne').resolves(undefined);
        sinon.stub(bcryptjs, 'compare').resolves(false);
      });

      it('Fails if the email is not passed', async () => {
        chaiHttpRes = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[0]);

        expect(chaiHttpRes.status).to.be.equal(400);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'All fields must be filled',
        });
      });

      it('Fails if the password is not passed', async () => {
        chaiHttpRes = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[1]);

        expect(chaiHttpRes.status).to.be.equal(400);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'All fields must be filled',
        });
      });

      it('Fails if the email is invalid', async () => {
        chaiHttpRes = await chai
          .request(app)
          .post('/login')
          .send(invalidLogins[2]);

        expect(chaiHttpRes.status).to.be.equal(401);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'Incorrect email or password',
        });
      });

      it('Fails if the password is invalid', async () => {
        chaiHttpRes = await chai
          .request(app)
          .post('/login')
          .send({ ...loginMock, password: 'coxinha' });

        expect(chaiHttpRes.status).to.be.equal(401);
        expect(chaiHttpRes.body).to.deep.equal({
          message: 'Incorrect email or password',
        });
      });
    });
  });
});

describe('"/login/validate" route integration tests', () => {
  let chaiHttpRes: Response;

  describe('GET', () => {
    beforeEach(() => {
      sinon.stub(jsonwebtoken, 'verify').resolves(Token);
    });

    afterEach(() => {
      (Users.findOne as sinon.SinonStub).restore();
      (jwt.verify as sinon.SinonStub).restore();
    });

    it('Returns the logged user role', async () => {
      sinon.stub(Users, 'findOne').resolves(userMock as Users);

      chaiHttpRes = await chai
        .request(app)
        .get('/login/validate')
        .set('Authorization', 'something');

      expect(chaiHttpRes.status).to.be.equal(200);
      console.log(chaiHttpRes.body);

      expect(chaiHttpRes.body).to.deep.equal({ role: userMock.role });
    });

    it('Fails if the user does not exists', async () => {
      sinon.stub(Users, 'findOne').resolves(undefined);

      chaiHttpRes = await chai
        .request(app)
        .get('/login/validate')
        .set('Authorization', 'something');

      expect(chaiHttpRes.status).to.be.equal(404);
      expect(chaiHttpRes.body).to.deep.equal({
        message: 'User not found',
      });
    });
  });
});