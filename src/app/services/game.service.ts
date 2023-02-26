import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Observable} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GameDto } from 'src/app/models/gameDto';
import { Page } from '../models/page';
import { MediaType } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  public getGames(pageIndex: number, pageSize: number, name: string | null = null): Observable<Page<GameDto>> {
      let params = new HttpParams()
        .set('size', pageSize)
        .set('page', pageIndex);

      if (name)
        params = params.set('name', name);

      return this.http.get<Page<GameDto>>(`${API_URL}/game`, {params});
  }

  public getById(id: number): Observable<GameDto>{
    return this.http.get<GameDto>(`${API_URL}/game/${id}`);
  }

  public create(game: GameDto): Observable<any>{
    return this.http.post(`${API_URL}/game`, game);
  }

  public update(game: GameDto): Observable<any>{
    return this.http.patch(`${API_URL}/game/${game.id}`, game);
  }

  public getLogoId(gameId: number): Observable<number[]>{
    const params = new HttpParams()
        .set('mediaType', MediaType.LOGO);

    return this.http.get<number[]>(`${API_URL}/game/${gameId}/media`, {params});
  }

  public getPicturesId(gameId: number): Observable<number[]>{
    const params = new HttpParams()
        .set('mediaType', MediaType.PICTURE);

    return this.http.get<number[]>(`${API_URL}/game/${gameId}/media`, {params});
  }

  public getVideosId(gameId: number): Observable<number[]>{
    const params = new HttpParams()
        .set('mediaType', MediaType.VIDEO);

    return this.http.get<number[]>(`${API_URL}/game/${gameId}/media`, {params});
  }

  public addLogo(file: any, gameId: number): Observable<any>{
    return this.updloadFile(file, gameId, MediaType.LOGO);
  }

  public addPicture(file: any, gameId: number): Observable<any>{
    return this.updloadFile(file, gameId, MediaType.PICTURE);
  }

  public addVideo(file: any, gameId: number): Observable<any>{
    return this.updloadFile(file, gameId, MediaType.VIDEO);
  }

  private updloadFile(file: File, gameId: number, mediaType: MediaType): Observable<number>{
    const params = new HttpParams()
    .set('mediaType', mediaType);

    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.put<number>(`${API_URL}/game/${gameId}/media`, formData, {params});
  }
}
