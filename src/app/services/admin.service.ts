import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {VmConfig} from '../models/vm.config.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url = 'https://localhost:4200/API/vm-os';

  constructor(private httpClient: HttpClient) { }

  // get used resources
  getUsedResources(): Observable<VmConfig>{
    return this.httpClient.get<VmConfig>(this.url + '/resources/used')
      .pipe(
        map(c => new VmConfig(c.id, undefined, undefined, c.maxCpu, c.maxRam, c.maxDisk, c.maxVm, c.maxActive)),
        catchError( err => {
          console.error(err);
          return throwError('AdminService getUsedResources error: ' + err.message);
        })
      );
  }

  // get reserved resources
  getReservedResources(): Observable<VmConfig>{
    return this.httpClient.get<VmConfig>(this.url + '/resources/reserved')
      .pipe(
        map(c => new VmConfig(c.id, undefined, undefined, c.maxCpu, c.maxRam, c.maxDisk, c.maxVm, c.maxActive)),
        catchError( err => {
          console.error(err);
          return throwError('AdminService getReservedResources error: ' + err.message);
        })
      );
  }

  // get allocated resources
  getAllocatedResources(): Observable<VmConfig>{
    return this.httpClient.get<VmConfig>(this.url + '/resources/allocated')
      .pipe(
        map(c => new VmConfig(c.id, undefined, undefined, c.maxCpu, c.maxRam, c.maxDisk, c.maxVm, c.maxActive)),
        catchError( err => {
          console.error(err);
          return throwError('AdminService getReservedAllocated error: ' + err.message);
        })
      );
  }


  shareCourse(courseName: string, professorId: string, memberIds: string[]): Observable<any>{
    return this.httpClient.post<any>(this.url + '/' + professorId + '/courses/' + courseName + '/cooperate' , memberIds)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError(`ProfessorService shareCourse error: ${err.message}`);
        })
      );
  }

  getPhoto(professorId: string): Observable<any>{
    return this.httpClient.get(this.url + '/' + professorId + '/photo',  { responseType: 'blob' });
  }
}
