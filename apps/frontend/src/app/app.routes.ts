import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { AutomotoresListPage } from './modules/automotores-list/automotores-list.page';
import { AutomotorFormPage } from './modules/automotores-form/automotor-form.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'automotores', component: AutomotoresListPage },
  { path: 'automotores/new', component: AutomotorFormPage },
  { path: 'automotores/:dominio/edit', component: AutomotorFormPage },
  { path: '**', redirectTo: 'automotores' }
];
