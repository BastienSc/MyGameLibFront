import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Observable} from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GameDto } from 'src/app/models/gameDto';
import { Page } from '../models/page';
import { MediaType } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  public getById(mediaId: number): Observable<any>{
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/octet-stream');
    headers.append('Accept', 'application/octet-stream');
    headers.append('Content-Disposition', 'attachment');
    headers

    return this.http.get(`${API_URL}/media/${mediaId}/download`,  {headers: headers, observe:'response' as 'response', responseType: 'arraybuffer'});
  }
}
