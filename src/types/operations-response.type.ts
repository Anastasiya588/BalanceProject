import {OperationResponseType} from "./operation-response.type";

export type OperationsResponseType = {
    error: boolean,
    response: OperationResponseType[]
}