import { Routes } from '@angular/router';
import { Produtos } from './pages/produtos/produtos';
import { Notas } from './pages/notas/notas';
import { NotaDetalhe } from './pages/nota-detalhe/nota-detalhe';

export const routes: Routes = [
  { path: '', component: Produtos },
  { path: 'notas', component: Notas },
  { path: 'notas/:id', component: NotaDetalhe }
];
