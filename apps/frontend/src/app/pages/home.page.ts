import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center gap-4 mt-8">
      <a routerLink="/automotores" class="px-4 py-2 bg-blue-600 text-white rounded">Ver listado</a>
    </div>
  `
})
export class HomePage { }
