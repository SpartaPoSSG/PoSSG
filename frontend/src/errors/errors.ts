import { ErrorBase } from "./error-base";

type ErrorName =
    | 'GET_PROJECT_ERROR'
    | 'CREATE_PROJECT_ERROR'
    | 'PROJECT_LIMIT_REACHED'

export class ProjectError extends ErrorBase<ErrorName> {}