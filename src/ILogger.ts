import Api from "./Api";

export interface ILogger {

    info(message: string, data: any): boolean;
    warning(message: string, data: any): boolean;
    critical(message: string, data: any): boolean;
    api(data: Api): boolean;

}