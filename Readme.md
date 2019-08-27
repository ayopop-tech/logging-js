# RMQLoggerJS

This is a helper package for integrating logger to a rabbitmq enabled micro-service , thus allowing for logging to console or a remote service which parses and forwards the requests to a provisoned ElasticSearch.

Although this is primaraily a  typescript module , you can use it in vanialla nodejs applications as well.

## Usage - apigateway express app integration
```
import  RMQLogger  from  "rmqlogger";
import Api from "rmqlogger";

let  rmqLogger  =  new  RMQLogger();
rmqLogger.init(rabbitmqConf);

//Usage in express
...
app.use(apiAcessLogger);
...
//
function apiAcessLogger(req: any, res: any, next: any) {
  let dto = new Api();
  dto.Ip = req.connection.ip;
  dto.Url = req.url;
  dto.Method = req.method
  dto.Headers = req.headers;
  dto.Request = req.body;
  var oldSend = res.json;
  
  res.json = function (data: any) {
    if (data == false) {
      data = { response: false };
    }
    dto.StatusCode = res.statusCode;
    dto.Timestamp = new Date().toISOString();
    dto.Response = data;
    oldSend.apply(res, arguments);
    //
    rmqLogger.api(dto);
    console.log("Log Sent.")
  }
  next();
}

```

The `rabbitmqConf` parameter required by init() function is a JSON object which is as follows. 
```
"rabbitmq": {
     "url": "amqp://user:passwd@localhost:5672",
     "app": "apigateway",
     "console" : false,
     "rmqExchangename" : "log-aggregator"
}
```
The `url` property is the url of your rabbitmq server ( not the managment url) and the `app` property provides a uniqe name to your service which is later used to identify the service and create queue names accordingly. The `rmqExchangename` is used to publish log events to the log-aggregator service which consumes this messages and forwards to ES much like logstash. The `console` flag if `true` prints all the logs to console else sends to Elasticsearch.

