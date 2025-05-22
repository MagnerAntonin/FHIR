import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {CommonModule} from '@angular/common';

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
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm! : FormGroup

  patients = [
    { id: '1', name: 'Alice Dupont' },
    { id: '2', name: 'Bob Martin' }
  ];

  doctors = [
    { id: '1', name: 'Dr. House' },
    { id: '2', name: 'Dr. Strange' }
  ];

  rooms = [
    { id: '1', name: 'Salle 101' },
    { id: '2', name: 'Salle 102' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: [''],
      doctor: [''],
      room: [''],
      startDateTime: [''],
      endDateTime: ['']
    });
  }

  onSubmit() {
    console.log(this.appointmentForm.value)
  }

  protected readonly onsubmit = onsubmit;
}
