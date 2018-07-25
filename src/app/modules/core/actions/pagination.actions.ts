import { Action } from '@ngrx/store';

export enum PaginationActionTypes {
    Forward = '[Pagination] Go to next page',
    Backward = '[Pagination] Go to previous page',
    GoTo = '[Pagination] Go to specific page'
};

export class Forward implements Action {
    readonly type = PaginationActionTypes.Forward;

    constructor(public options: any) { }
}

export class Backward implements Action {
    readonly type = PaginationActionTypes.Backward;

    constructor(public options: any) { }
}

export class GoTo implements Action {
    readonly type = PaginationActionTypes.GoTo;

    constructor(public options: any) { }
}

export type PaginationActions
    = Forward
    | Backward
    | GoTo;
