import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirService } from '../../../services/fhir.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(private fhirService: FhirService) { }

  /*ngOnInit(): void {
    this.fhirService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data?.entry?.map((e: any) => e.resource) || [];
        this.loading = false;
        },
          error: (err) => {
            console.error('Erreur lors de la récupération des RDVs :', err);
            this.loading = false;
          },
    });
  }*/

  ngOnInit(): void {
    this.fhirService.getAppointments().subscribe({
      next: (data) => {
        const entries = data?.entry || [];

        const mappedAppointments = entries.map((entry: any) => entry.resource);
        mappedAppointments.sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime()); // Sort the list by order

        const enrichments = mappedAppointments.map(async (appt: any) => {
          const participants: any[] = appt.participant || [];

          const patientRef = participants.find((p: any) =>
            p.actor.reference.startsWith('Patient/')
          )?.actor.reference;

          const practitionerRef = participants.find((p: any) =>
            p.actor.reference.startsWith('Practitioner/')
          )?.actor.reference;

          const [patient, practitioner] = await Promise.all([
            patientRef ? this.fhirService.getResourceByReference(patientRef).toPromise() : null,
            practitionerRef ? this.fhirService.getResourceByReference(practitionerRef).toPromise() : null,
          ]);

          return {
            ...appt,
            patient: patient ? {
              name: patient.name?.[0]?.given?.[0] + ' ' + patient.name?.[0]?.family
            } : null,
            practitioner: practitioner ? {
              name: practitioner.name?.[0]?.given?.[0] + ' ' + practitioner.name?.[0]?.family
            } : null
          };
        });

        Promise.all(enrichments).then((results) => {
          this.appointments = results;
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des RDVs :', err);
        this.loading = false;
      },
    });
  }
}
