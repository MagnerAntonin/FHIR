import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppointmentDetailsComponent} from './features/appointment/appointment-details/appointment-details.component';
import { AppointmentFormComponent} from './features/appointment/appointment-form/appointment-form.component';
import { AppointmentListComponent} from './features/appointment/appointment-list/appointment-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'details', component : AppointmentDetailsComponent, title: 'Détails'},
  { path: 'form', component : AppointmentFormComponent, title: 'Formulaire'},
  { path: 'list', component : AppointmentListComponent, title: 'Liste'},
  { path: '**', component: NotFoundComponent, title: 'Page not found'}
];

