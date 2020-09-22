import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {VmConfig} from '../models/vm.config.model';
import {VmModelsList} from '../models/vm.models.list.model';
import {Vm} from '../models/vm.model';

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

  //
  // shareCourse(courseName: string, professorId: string, memberIds: string[]): Observable<any>{
  //   return this.httpClient.post<any>(this.url + '/' + professorId + '/courses/' + courseName + '/cooperate' , memberIds)
  //     .pipe(
  //       catchError( err => {
  //         console.error(err);
  //         return throwError(`ProfessorService shareCourse error: ${err.message}`);
  //       })
  //     );
  // }

  deleteOs(osName: string): Observable<any>{
    return this.httpClient.delete<any>(this.url + '/' + osName)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError(`AdminService deleteOs error: ${err.message}`);
        })
      );
  }

  addOs(os: VmModelsList): Observable<VmModelsList>{
    return this.httpClient.post<VmModelsList>(this.url, os)
      .pipe(
        map(s2 => new VmModelsList(s2.id, s2.osName, s2.versions)),
        catchError( err => {
          console.error(err);
          return throwError('AdminService addOs error:' + err.message);
        })
      );
  }

  addVersion(osName: string, version: string): Observable<VmModelsList>{
    return this.httpClient.post<VmModelsList>(this.url + '/' + osName, version)
      .pipe(
        map(s2 => new VmModelsList(s2.id, s2.osName, s2.versions)),
        catchError( err => {
          console.error(err);
          return throwError('AdminService addVersion error:' + err.message);
        })
      );
  }

  deleteVersion(osName: string, version: string): Observable<VmModelsList>{
    return this.httpClient.delete<any>(this.url + '/' + osName + '/' + version)
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError('AdminService deleteVersion error:' + err.message);
        })
      );
  }

  getPhoto(professorId: string): Observable<any>{
    return this.httpClient.get(this.url + '/' + professorId + '/photo',  { responseType: 'blob' });
  }
}
