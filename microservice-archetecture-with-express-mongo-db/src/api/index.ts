import { Router } from "express";
import agendash from './routes/agendash';

export default () => {
    const app = Router();
    agendash(app);
    return app;
}