import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GameDto } from 'src/app/models/gameDto';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  public getGames(pageIndex: number, pageSize: number): Observable<Page<GameDto>> {
      const params = new HttpParams()
        .set('size', pageSize)
        .set('page', pageIndex);

      return this.http.get<Page<GameDto>>(`${API_URL}/game`, {params});
  }

  public getById(id: number): Observable<GameDto>{
    return this.http.get<GameDto>(`${API_URL}/game/${id}`);
  }
}
