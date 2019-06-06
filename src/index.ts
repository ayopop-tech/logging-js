import { ILogger } from "./ILogger";
import Api from "./Api";

export default class Logging implements ILogger {

    init(config: any) {

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
        throw new Error("Method not implemented.");
    }


}