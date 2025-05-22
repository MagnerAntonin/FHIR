import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirService } from '../../../services/fhir.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(private fhirService: FhirService) {}

  ngOnInit(): void {
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
  }
}
