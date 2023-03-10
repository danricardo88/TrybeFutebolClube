import * as express from 'express';
import loginRout from './router/loginRout';
import httpErrorMid from './middlewares/HttpErrorMid';
import teamRout from './router/teamRout';
import MatchRouter from './router/matchRouter';
import leaderboardRouter from './router/leaderboardRouter';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use('/login', loginRout);
    this.app.use('/teams', teamRout);
    this.app.use('/matches', MatchRouter);
    this.app.use('/leaderboard', leaderboardRouter);

    this.app.use(httpErrorMid);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
// export const { app } = new App();
