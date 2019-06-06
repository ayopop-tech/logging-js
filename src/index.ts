import { ILogger } from "./ILogger";
import Api from "./Api";
import * as amqp from 'amqplib';
import { Connection, Channel, Replies } from 'amqplib';


export default class Logging implements ILogger {

    private static CONN: Connection;
    private static CHAN: Channel;

    init(rmqConfig: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            amqp.connect(rmqConfig.url).then((connectedCon: Connection) => {
                Logging.CONN = connectedCon;
                Logging.CONN.createChannel().then((ch: Channel) => {
                    Logging.CHAN = ch;
                    res();
                });
            });
        });
    }

    private publish(topic: string, message: any): any {
        const buff = Buffer.from(JSON.stringify(message));
        const tempsplit = topic.split('.');
        const routingKey = tempsplit[1];
        const exchange = tempsplit[0];
        const ok = Logging.CHAN.publish(exchange, routingKey, buff);
        console.log('[x] Event Published : ' + topic);
        return ok;
    }

    info(message: string, data: any): boolean {
        throw new Error("Method not implemented.");
    }
    warning(message: string, data: any): boolean {
        throw new Error("Method not implemented.");
    }
    critical(message: string, data: any): boolean {
        throw new Error("Method not implemented.");
    }
    api(data: Api): boolean {

        this.publish("ayopop.api",data);
        throw new Error("Method not implemented.");
    }


}