import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FhirService {
  private apiUrl = environment.fhirApiUrl;

  constructor(private http: HttpClient) { }

  getAppointments(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get(`${this.apiUrl}/Appointment`, { params: httpParams });
  }

  getAppointmentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Appointment/${id}`);
  }

  getPatients(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      })
    }

    return this.http.get(`${this.apiUrl}/Patient`, { params: httpParams });
  }

  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patient/${id}`);
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

  getPractitionerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Practitioner/${id}`);
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Location/${id}`);
  }

  getResourceByReference(reference: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${reference}`);
  }

  // Add
  getReferenceId = (appt: any, resourceType: string): string | null => {
    const match = appt.participant?.find((p: any) =>
      p.actor?.reference?.startsWith(`${resourceType}/`)
    );
    return match?.actor?.reference?.split('/')[1] || null;
  };

}
