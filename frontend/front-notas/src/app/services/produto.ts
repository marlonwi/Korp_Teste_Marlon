import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private api = 'http://localhost:5156/produtos';

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get(this.api);
  }

  criar(produto: any): Observable<any> {
    return this.http.post(this.api, produto);
  }
}
