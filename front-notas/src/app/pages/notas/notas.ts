import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaService } from '../../services/nota';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notas.html',
  styleUrl: './notas.css'
})
export class Notas implements OnInit {

  notas: any[] = [];

  constructor(
    private notaService: NotaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  loading = false;

  carregar() {
    this.loading = true;

    this.notaService.listar().subscribe({
      next: (res) => {
        this.notas = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  criarNota() {
    this.loading = true;

    this.notaService.criar().subscribe(() => {
      this.carregar();
    });
  }
}
