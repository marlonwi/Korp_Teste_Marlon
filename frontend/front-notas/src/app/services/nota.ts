import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  private api = 'http://localhost:5184/notas';

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get(this.api);
  }

  criar(): Observable<any> {
    return this.http.post(this.api, {});
  }
  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }
  adicionarItens(id: number, itens: any): Observable<any> {
    return this.http.post(`${this.api}/${id}/itens`, itens);
  }
  fecharNota(id: number): Observable<any> {
    return this.http.post(`${this.api}/${id}/fechar`, {});
  }
}
