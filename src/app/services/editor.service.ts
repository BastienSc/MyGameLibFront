import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Page } from '../models/page';
import { Observable, of, map, tap} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EditorDto } from '../models/editorDto';
import { MediaService } from 'src/app/services/media.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient, private mediaService:MediaService) { }

  public getById(id: number): Observable<EditorDto>{
    return this.http.get<EditorDto>(`${API_URL}/editor/${id}`);
  }

  public getAllEditors(): Observable<EditorDto[]>{
   return this.getPaginatedEditors(null, null).pipe(
      map((p: Page<EditorDto>) => p.content)
    )
  }

  public getPaginatedEditors(pageIndex: number | null, pageSize: number | null, searchTerm: string | null = null): Observable<Page<EditorDto>>{
    if (pageIndex != null && pageSize != null){
      const params = new HttpParams()
      .set('size', pageSize)
      .set('page', pageIndex);

      if (searchTerm) {
        params.set('name', searchTerm);
      }

      return this.http.get<Page<EditorDto>>(`${API_URL}/editor`, {params});
    }
    else return this.http.get<Page<EditorDto>>(`${API_URL}/editor`);
  }

  public create(editor:EditorDto): Observable<EditorDto> {
    return this.http.post<EditorDto>(`${API_URL}/editor`, editor);
  }

  public update(id:number, editor:EditorDto): Observable<EditorDto> {
    return this.http.patch<EditorDto>(`${API_URL}/editor/${id}`, editor);
  }

  public addLogo(id:number, formData:FormData): Observable<string> {
    return this.http.put<string>(`${API_URL}/editor/${id}/logo`, formData);
  }

  public getLogoId(id:number): Observable<number> {
    return this.http.get<number>(`${API_URL}/editor/${id}/logo`);
  }

  public loadLogo(editorId:number, callback:(file:File, preview:string|ArrayBuffer|null|undefined)=>void) {
    this.getLogoId(editorId).subscribe(mediaId => {
      this.mediaService.getById(mediaId).subscribe(response => {
        const file = new File([response.body], `${response.headers.get('file-name')}${response.headers.get('file-extension')}`);
        const reader = new FileReader();
        reader.onload = (e) => {
          callback(file, e.target?.result);
        }
        reader.readAsDataURL(file);
      });
    });
  }
}
