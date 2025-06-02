import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppointmentDetailsComponent } from './features/appointment/appointment-details/appointment-details.component';
import { AppointmentFormComponent } from './features/appointment/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './features/appointment/appointment-list/appointment-list.component';
import { AboutComponent } from './about/about.component';
import { CalendarViewComponent} from '../app/features/calendar-view/calendar-view.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Accueil' },
    { path: 'details/:id', component: AppointmentDetailsComponent, title: 'Détails RDV' },
    { path: 'form', component: AppointmentFormComponent, title: 'Nouveau RDV' },
    { path: 'list', component: AppointmentListComponent, title: 'Liste RDV' },
    { path: 'calendar', component: CalendarViewComponent, title: 'Calendrier'},
    { path: 'about', component: AboutComponent, title: 'A Propos'},
    { path: '**', component: NotFoundComponent, title: 'Page non trouvé' }
];

