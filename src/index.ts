import { ILogger } from './ILogger';
import Api from './Api';
import * as amqp from 'amqplib';
import { Connection, Channel, Replies } from 'amqplib';

export default class RMQLogger implements ILogger {
  private static CONN: Connection;
  private static CHAN: Channel;
  private static APP: string;

  public init(config: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      RMQLogger.APP = config.app;
      amqp.connect(config.url).then((connectedCon: Connection) => {
        RMQLogger.CONN = connectedCon;
        RMQLogger.CONN.createChannel().then((ch: Channel) => {
          RMQLogger.CHAN = ch;
          res();
        });
      });
    });
  }

  public info(message: string, data: any): boolean {
    throw new Error('Method not implemented.');
  }
  public warning(message: string, data: any): boolean {
    throw new Error('Method not implemented.');
  }
  public critical(message: string, data: any): boolean {
    throw new Error('Method not implemented.');
  }
  public api(data: Api): boolean {
    data.Source = RMQLogger.APP;
    return this.publish('ayopop.api', data);
  }

  private publish(topic: string, message: any): any {
    const buff = Buffer.from(JSON.stringify(message));
    const tempsplit = topic.split('.');
    const routingKey = tempsplit[1];
    const exchange = tempsplit[0];
    const ok = RMQLogger.CHAN.publish(exchange, routingKey, buff);
    console.log('[x] Event Published : ' + topic);
    return ok;
  }
}
