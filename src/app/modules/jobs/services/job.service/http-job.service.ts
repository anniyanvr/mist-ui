import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Job } from '@app/modules/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpService } from '@app/modules/core/services';

@Injectable()
export class HttpJobService {
    private baseUrl = {
        jobs: '/jobs',
        functions: '/functions'
    };

    constructor(private http: HttpService) {
    }

    public get(): Observable<{ jobs: Job[], total: number }> {
        return this.http.get(`${this.baseUrl.jobs}?paginate=true`)
            .map((res: Response) => this.extractJobs(res))
            .catch(this.handleError);
    }

    public getAll(): Observable<Job[]> {
        return this.http.get(this.baseUrl.jobs)
            .map((res: Response) => this.extractJobs(res))
            .catch(this.handleError);
    }

    public where(args: object): Observable<Job[]> {
        const options = this.parseArgs(args);
        const apiUrl = this.baseUrl.jobs + `?` + options;
        return this.http.get(apiUrl)
            .map((res: Response) => this.extractJobs(res))
            .catch(this.handleError);
    }

    public getJobsWorker(jobId: string) {
        const apiUrl = `${this.baseUrl.jobs}/${jobId}/worker`;
        return this.http.get(apiUrl)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    public getByFunctionId(id: string): Observable<Job[]> {
        const apiUrl = this.baseUrl.functions + `/${id}/jobs`;
        return this.http.get(apiUrl)
            .map((res: Response) => { return this.extractJobs(res) })
            .catch(this.handleError);
    }

    public getJob(id: string): Observable<Job> {
        const apiUrl = this.baseUrl.jobs + `/${id}`;
        return this.http.get(apiUrl)
            .map((res: Response) => { return this.extractJob(res) })
            .catch(this.handleError);
    }

    public create(functionId: string, args: string): Observable<any> {
        const apiUrl = this.baseUrl.functions + `/${functionId}/jobs`;

        return this.http.post(apiUrl, JSON.stringify(JSON.parse(args)))
            .map(this.extractData)
            .catch(this.handleError);
    }

    public kill(jobId: string): Observable<Job> {
        const apiUrl = this.baseUrl.jobs + `/${jobId}`;
        return this.http.delete(apiUrl)
            .map((res: Response) => this.extractJob(res))
            .catch(this.handleError);
    }

    private parseArgs(options): string {
        const args = Object.keys(options);
        const params = args.map((arg) => {
            return `${arg}=` + options[arg].join(`&${arg}=`);
        });
        return params.join('&');
    }

    private extractJobs(res: Response) {
        const data = res.json();
        console.log(data);
        const jobs: Job[] = [];
        if (data.jobs) {
            for (let index in data.jobs) {
                if (data.jobs.hasOwnProperty(index)) {
                    let job = this.toJob(data.jobs[index]);
                    jobs.push(job);
                }
            }
            return { jobs: jobs, total: data.total };
        } else {
            for (let index in data) {
                if (data.hasOwnProperty(index)) {
                    let job = this.toJob(data[index]);
                    jobs.push(job);
                }
            }
            return jobs;
        }
    }

    private extractJob(res: Response) {
        const data = res.json();
        return this.toJob(data);
    }

    private toJob(data): Job {
        return new Job(data);
    }

    private extractData(res: Response) {
        const data = res.json();
        return data || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.text() || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}