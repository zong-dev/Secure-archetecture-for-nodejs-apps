import { Agenda } from "agenda/es";
import config from "../config";

export default ({mongoConnection}) => {
    return new Agenda({
        mongo: mongoConnection,
        db: { collection: config.agenda.dbCollection, address: config.databaseURL },
        processEvery: config.agenda.pooltime,
        maxConcurrency: config.agenda.concurrency,
    });
}