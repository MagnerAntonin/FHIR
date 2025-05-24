import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Patient } from '../../../services/patient.model';
import { Practitioner } from '../../../services/practitioner.model';
import { RouterModule } from '@angular/router';

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
  rooms = [
    { id: '1', name: 'Salle 101' },
    { id: '2', name: 'Salle 102' }
  ];
  today: Date = new Date(); // Add

  constructor(private fb: FormBuilder, private fhirService: FhirService) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: ['', Validators.required],
      doctor: ['', Validators.required],
      room: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });

    // -------------
    /*Add function to retrieve Appointments*/
    this.fhirService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = (data?.entry || []).map((entry: any) => entry.resource);
        //console.log(this.appointments);
        this.loading = false;
      },
      error(err) {
        console.error('Erreur lors de la récupération des RDVs :', err);
        //this.loading = false;
      },
    });
    // -------------

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
  }

  onSubmit() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    // -----------
    // Add
    const formValue = this.appointmentForm.value;

    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    const startTime = new Date(formValue.startTime);
    const endTime = new Date(formValue.endTime);

    // Création d’un DateTime combiné : date + heure
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds()
    ).toISOString();

    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds()
    ).toISOString();

    const patientId = formValue.patient;
    const practitionerId = formValue.doctor;

    if (this.hasConflicts(patientId, practitionerId, start, end)) {
      alert("Conflit détecté : ce patient ou ce praticien a déjà un RDV à ce créneau.");
      return;
    }

    console.log({
      patient: patientId,
      doctor: practitionerId,
      room: formValue.room,
      startDate: start,
      endDate: end
    });
    // -----------

    console.log(this.appointmentForm.value);
    this.appointmentForm.reset(); // To reset the form

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
