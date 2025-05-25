import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirService } from '../../../services/fhir.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})

export class AppointmentDetailsComponent implements OnInit {
  appointment: any;
  patient: any;
  practitioner: any;
  location: any;

  constructor(
    private route: ActivatedRoute,
    private fhirService: FhirService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fhirService.getAppointmentById(id).subscribe(appt => {
          //console.log('RDV reçu :', appt);
          this.appointment = appt;

          const patientId = this.fhirService.getReferenceId(appt, 'Patient');
          const practitionerId = this.fhirService.getReferenceId(appt, 'Practitioner');
          const locationId = this.fhirService.getReferenceId(appt, 'Location');

          if (patientId) {
            this.fhirService.getPatientById(patientId).subscribe(p => this.patient = p);
          }
          if (practitionerId) {
            this.fhirService.getPractitionerById(practitionerId).subscribe(pr => this.practitioner = pr);
          }
          if (locationId) {
            this.fhirService.getLocationById(locationId).subscribe(loc => this.location = loc);
          }
        });
      }
    });
  }
}
