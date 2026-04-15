import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  produtos: any[] = [];

  novoProduto = {
    descricao: '',
    saldo: 0
  };

  constructor(
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.produtoService.listar().subscribe(res => {
      this.produtos = res;
      this.cdr.detectChanges();
    });
  }

  criarProduto() {

    if (!this.novoProduto.descricao || this.novoProduto.descricao.trim() === '') {
      this.snackBar.open('Descrição é obrigatória', 'OK', { duration: 3000 });
      return;
    }

    const produto = {
      descricao: this.novoProduto.descricao,
      saldo: this.novoProduto.saldo
    };

    this.produtoService.criar(produto).subscribe({
      next: () => {
        this.novoProduto = { descricao: '', saldo: 0 };
        this.carregar();

        this.snackBar.open('Produto criado com sucesso!', 'OK', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erro ao criar produto:', err);

        this.snackBar.open('Erro ao criar produto', 'OK', {
          duration: 3000
        });
      }
    });
  }
}
