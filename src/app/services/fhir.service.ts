import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FhirService {
  private apiUrl = environment.fhirApiUrl;

  constructor(private http: HttpClient) {}

  getAppointments(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get(`${this.apiUrl}/Appointment`, { params: httpParams });
  }

  getPatients(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if(params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      })
    }

    return this.http.get(`${this.apiUrl}/Patient` , { params: httpParams });
  }

  getPractitioners(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get(`${this.apiUrl}/Practitioner`, { params: httpParams });
  }

  getLocations(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get(`${this.apiUrl}/Location `, { params: httpParams });
  }
}
