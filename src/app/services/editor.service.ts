import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Page } from '../models/page';
import { Observable, of, map} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EditorDto } from '../models/editorDto';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient) { }

  public getAllEditors(): Observable<EditorDto[]>{
   return this.getPaginatedEditors(null, null).pipe(
      map((p: Page<EditorDto>) => p.content)
    )
  }
  
  public getPaginatedEditors(pageIndex: number | null, pageSize: number | null): Observable<Page<EditorDto>>{
    if (pageIndex != null && pageSize != null){
      const params = new HttpParams()
      .set('size', pageSize)
      .set('page', pageIndex);
      
      return this.http.get<Page<EditorDto>>(`${API_URL}/editor`, {params});
    }
    else return this.http.get<Page<EditorDto>>(`${API_URL}/editor`);
  }
}
