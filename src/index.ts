import { ILogger } from './ILogger';
import Api from './Api';
import * as amqp from 'amqplib';
import { Connection, Channel, Replies } from 'amqplib';
import { assignmentPattern } from '@babel/types';

export default class RMQLogger implements ILogger {
  private static CONN: Connection;
  private static CHAN: Channel;
  private static APP: string;
  private static CONSOLE: boolean;
  private static RMQEXCHANGENAME: string;

  public init(config: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      RMQLogger.APP = config.app;
      RMQLogger.CONSOLE = config.console;
      RMQLogger.RMQEXCHANGENAME = config.rmqExchangeName;
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
    return this.logme("info", data)
  }
  public warning(message: string, data: any): boolean {
    return this.logme("warning", data)
  }
  public critical(message: string, data: any): boolean {
    return this.logme("critical", data)
  }
  public api(data: Api): boolean {
    data.Source = RMQLogger.APP;
    return this.publish(RMQLogger.RMQEXCHANGENAME + '.api', data);
  }

  public logme(level: string, data: any) {

    data["Timestamp"] = new Date().toISOString();

    if (RMQLogger.CONSOLE === true) {
      console.log(data);
      return true;
    } else {
      return this.publish(RMQLogger.RMQEXCHANGENAME + '.' + level, data);
    }

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

