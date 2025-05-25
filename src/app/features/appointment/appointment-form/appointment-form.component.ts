import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { FhirService } from '../../../services/fhir.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CommonModule } from '@angular/common';
import { Location } from '../../../services/location.model';
import { Patient } from '../../../services/patient.model';
import { Practitioner } from '../../../services/practitioner.model';
import { Appointment } from '../../../services/appointment.model';
import { RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-appointment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})

export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  appointments: any[] = []; // Add
  loading = true; // Add
  patients: any[] = [];
  practitioners: any[] = [];
  locations: any[] = [];
  today: Date = new Date(); // Add


  constructor(private fb: FormBuilder, private fhirService: FhirService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: ['', Validators.required],
      practitioner: ['', Validators.required],
      location: ['', Validators.required],
      reason: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });

    // -----------
    // Add
    this.route.queryParams.subscribe(params => {
      const start = params['start'];
      const end = params['end'];

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate >= today) {
          const formattedStartDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
          const formattedEndDate = startDate.toISOString().split('T')[0];
          const formattedStartTime = startDate.toTimeString().slice(0, 5); // HH:mm
          const formattedEndTime = endDate.toTimeString().slice(0, 5);

          this.appointmentForm.patchValue({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime
          });
        }
      }
    });

    // -----------

    this.fhirService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = (data?.entry || []).map((entry: any) => entry.resource);
        this.loading = false;
      },
      error(err) {
        console.error('Erreur lors de la récupération des RDVs :', err);
      },
    });
    this.fhirService.getPractitioners().subscribe({
      next: (data) => {
        this.practitioners = (data?.entry || []).map((entry: any) => {
          return new Practitioner(entry.resource);
        });
        console.log(this.practitioners);
      }
    });
    this.fhirService.getPatients().subscribe({
      next: (data) => {
        this.patients = (data?.entry || []).map((entry: any) => {
          return new Patient(entry.resource);
        });
        console.log(this.patients);
      }
    });
    this.fhirService.getLocations().subscribe({
      next: (data) => {
        this.locations = (data?.entry || []).map((entry: any) => {
          return new Location(entry.resource);
        });
        console.log(this.locations);
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.appointmentForm.value;

    const start = this.combineDateAndTime(formValue.startDate, formValue.startTime);
    const end = this.combineDateAndTime(formValue.endDate, formValue.endTime);

    if (this.hasConflicts(formValue.patient, formValue.practitioner, start, end)) {
      alert("Conflit détecté : ce patient ou ce praticien a déjà un RDV à ce créneau.");
      return;
    }

    const appointment = new Appointment(
      formValue.patient,
      formValue.practitioner,
      formValue.location,
      start,
      end,
      formValue.reason
    );

    console.log('Appointment à envoyer :', appointment);
    console.log(JSON.stringify(appointment, null, 2))
    this.fhirService.createAppointment(appointment).subscribe({
      next: (res) => {
        console.log('Rendez-vous créé:', res);
        alert('Rensez-vous créé avec succès !');
        this.appointmentForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors de la création du rendez-vous :', err);
        alert('Erreur lors de la création du rendez-vous.');
      }
    })
  }

  combineDateAndTime(date: string | Date, time: string | Date): string {
    const d = new Date(date);
    const t = new Date(time);
    const combined = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds()
    );
    return combined.toISOString()
  }

  protected readonly onsubmit = onsubmit;

  onCancel() {
    this.appointmentForm.reset();
  }

  /*Add function to check conflicts*/
  hasConflicts(patientId: string, practitionerId: string, start: string, end: string): boolean {
    return this.appointments.some(appt => {
      const apptStart = new Date(appt.start).getTime();
      const apptEnd = new Date(appt.end).getTime();
      const newStart = new Date(start).getTime();
      const newEnd = new Date(end).getTime();

      const overlaps = newStart < apptEnd && newEnd > apptStart;

      const participants = appt.participant.map((p: any) => p.actor.reference);

      const patientConflict = participants.includes(`Patient/${patientId}`);
      const practitionerConflict = participants.includes(`Practitioner/${practitionerId}`);

      return overlaps && (patientConflict || practitionerConflict);
    });
  }
}
