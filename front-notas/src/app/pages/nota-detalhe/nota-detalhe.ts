import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotaService } from '../../services/nota';
import { ProdutoService } from '../../services/produto';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-nota-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './nota-detalhe.html',
  styleUrl: './nota-detalhe.css'
})
export class NotaDetalhe implements OnInit {

  nota: any;
  produtos: any[] = [];

  novoItem = {
    produtoId: 0,
    quantidade: 1
  };

  fechando = false;

  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService,
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.carregarNota(id);
    this.carregarProdutos();
  }

  carregarNota(id: number) {
    this.notaService.buscarPorId(id).subscribe(res => {
      this.nota = res;
      this.cdr.detectChanges();
    });
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe(res => {
      this.produtos = res;
    });
  }

  adicionarItem() {
    const id = this.route.snapshot.params['id'];

    if (!this.novoItem.produtoId) {
      this.snackBar.open('Selecione um produto', 'OK', { duration: 3000 });
      return;
    }

    if (this.novoItem.quantidade <= 0) {
      this.snackBar.open('Quantidade deve ser maior que 0', 'OK', { duration: 3000 });
      return;
    }

    const payload = {
      itens: [this.novoItem]
    };

    this.notaService.adicionarItens(id, payload).subscribe({
      next: () => {
        this.novoItem = { produtoId: 0, quantidade: 1 };
        this.carregarNota(id);

        this.snackBar.open('Item adicionado!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Erro ao adicionar item', 'OK', {
          duration: 3000
        });
      }
    });
  }

  fecharNota() {
    const id = this.route.snapshot.params['id'];
    this.fechando = true;

    this.notaService.fecharNota(id).subscribe({
      next: () => {
        this.carregarNota(id);
        this.fechando = false;

        this.snackBar.open('Nota fechada com sucesso!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.fechando = false;

        this.snackBar.open(err.error || 'Erro ao fechar nota', 'OK', {
          duration: 4000
        });
      }
    });
  }

  imprimirNota() {
    window.print();
  }
}
