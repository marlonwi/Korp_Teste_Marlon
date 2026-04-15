import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span>Sistema de Faturamento</span>

      <span class="spacer"></span>

      <button mat-button routerLink="/">Produtos</button>
      <button mat-button routerLink="/notas">Notas</button>
    </mat-toolbar>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1;
    }

    .content {
      padding: 20px;
    }
  `]
})
export class App { }
