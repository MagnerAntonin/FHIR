import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'about',
        component: AboutComponent,
        title: 'À propos'
    },
    {
        path: '**',
        component: NotFoundPageComponent,
        title: 'Page non trouvée'
    }
];