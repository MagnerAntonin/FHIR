import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { FhirService } from '../../../services/fhir.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
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
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})

export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup

  patients: any[] = [];

  practitioners: any[] = [];

  rooms = [
    { id: '1', name: 'Salle 101' },
    { id: '2', name: 'Salle 102' }
  ];

  constructor(private fb: FormBuilder, private fhirService: FhirService) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: [''],
      doctor: [''],
      room: [''],
      startDateTime: [''],
      endDateTime: ['']
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
  }

  onSubmit() {
    console.log(this.appointmentForm.value)
  }

  protected readonly onsubmit = onsubmit;
}
