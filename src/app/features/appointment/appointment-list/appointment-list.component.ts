import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirService } from '../../../services/fhir.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(private fhirService: FhirService, private router: Router) { }

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

  searchTerm: string = '';
  allAppointments: any[] = [];
  periodFilter: 'Toute' | 'A Venir' | 'Passé' = 'Toute';

  ngOnInit(): void {
    this.fhirService.getAppointments().subscribe({
      next: async (data) => {
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

        const results = await Promise.all(enrichments);
        this.allAppointments = results; // Garde la liste complète
        this.filterAppointments(); // Applique filtre + tri
        this.loading = false;

        this.periodFilter = 'Toute';
        this.filterByPeriod();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des RDVs :', err);
        this.loading = false;
      },
    });
  }

  sortKey = 'startAsc';

  sortAppointments() {
    this.appointments.sort((a: any, b: any) => {
      switch (this.sortKey) {
        case 'startAsc':
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        case 'startDesc':
          return new Date(b.start).getTime() - new Date(a.start).getTime();
        case 'patientAsc':
          return (a.patient?.name || '').localeCompare(b.patient?.name || '');
        case 'patientDesc':
          return (b.patient?.name || '').localeCompare(a.patient?.name || '');
        case 'practitionerAsc':
          return (a.practitioner?.name || '').localeCompare(b.practitioner?.name || '');
        case 'practitionerDesc':
          return (b.practitioner?.name || '').localeCompare(a.practitioner?.name || '');
        default:
          return 0;
      }
    });
  }

  filterAppointments() {
    const term = this.searchTerm.trim().toLowerCase();

    this.appointments = this.filteredAppointments.filter(appt => {
      const patientName = appt.patient?.name?.toLowerCase() || '';
      return patientName.includes(term);
    });

    this.sortAppointments(); // trie après filtrage
  }

  filteredAppointments: any[] = [];
  filterByPeriod() {
    const now = new Date();

    this.filteredAppointments = this.allAppointments.filter(appt => {
      const start = new Date(appt.start);

      switch (this.periodFilter) {
        case 'A Venir':
          return start >= now;
        case 'Passé':
          return start < now;
        case 'Toute':
        default:
          return true;
      }
    });

    this.filterAppointments();
  }


  showDetails(appt: any) {
    this.router.navigate(['/details', appt.id]);
  }

  deleteAppointment(appt: any, event: MouseEvent) {
    event.stopPropagation(); // Empêche l'ouverture des détails

    if (confirm('Supprimer ce rendez-vous ?')) {
      this.fhirService.deleteAppointment(appt.id).subscribe({
        next: () => {
          // Retirer le RDV localement
          this.appointments = this.appointments.filter(a => a.id !== appt.id);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Une erreur est survenue lors de la suppression du rendez-vous.');
        }
      });
    }
  }
}
