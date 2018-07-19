import * as fromRoot from '@core/reducers';
import * as fromJobs from './jobs.reducer';
import * as fromJobLogs from './job-logs.reducer';
import * as fromWorkers from '@workers/reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Job, Worker } from '@shared/models';

export interface JobsState {
    jobs: fromJobs.State,
    jobLogs: string[]
}

export interface State extends fromRoot.MistState {
    jobs: JobsState
}

export const reducers: ActionReducerMap<JobsState> = {
    jobs: fromJobs.reducer,
    jobLogs: fromJobLogs.reducer
}

export const getJobsState = createFeatureSelector<JobsState>('jobs');

export const getJobEntitiesState = createSelector(
    getJobsState,
    state => state.jobs
);

export const getJobLogsEntitiesState = createSelector(
    getJobsState,
    state => state.jobLogs
);

export const getJobLogs = createSelector(
    getJobLogsEntitiesState,
    entities => entities
)

export const {
    selectEntities: getJobEntities,
    selectAll: getAllJobs,
    selectTotal: getTotalJobs,
} = fromJobs.adapter.getSelectors(getJobEntitiesState);

export const getJobs = createSelector(
    getAllJobs,
    fromRoot.getRouterState,
    (jobs, router) => router.state && jobs.filter(job => {
        // ToDo: Fix that
        if (router.state.params.functionId === 'overview') {
            return job.functionId
        } else {
            return router.state.params.functionId === job.functionId
        }
    })
)

export const getSelectedJobId = createSelector(
    fromRoot.getRouterState,
    (router): string => router.state && router.state.params.jobId
);

export const getSelectedJob = createSelector(
    getJobEntities,
    fromRoot.getRouterState,
    (entities, router): Job => router.state && entities[router.state.params.jobId]
);

export const getParamsOfCurrentJob = createSelector(
    getSelectedJob,
    job => job && job.params.arguments
);

export const getJobWorkerId = createSelector(
    getJobEntities,
    fromRoot.getRouterState,
    (entities, router): string => router.state && entities[router.state.params.jobId] && entities[router.state.params.jobId].workerId
);

export const getJobWorker = createSelector(
    getJobWorkerId,
    fromWorkers.getWorkerEntities,
    (workerId, workerEntities): Worker => workerEntities[workerId]
);

export const getCurrentWorkerJobs = createSelector(
    getJobEntities,
    fromRoot.getRouterState,
    (entities, router) => router.state && entities[router.state.params.workerId]
);

export const getStartedJobs = (functionId) => createSelector(
    getAllJobs,
    jobs => jobs.filter(job => job.functionId === functionId).length
)
