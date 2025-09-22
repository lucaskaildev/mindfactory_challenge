import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { AutomotoresListPage } from './modules/automotores-list/automotores-list.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'automotores', component: AutomotoresListPage },
  { path: '**', redirectTo: 'automotores' }
];
