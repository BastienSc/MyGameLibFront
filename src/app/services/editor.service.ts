import { Injectable } from '@angular/core';
import { API_URL } from '../shared/constants';
import { Page } from '../models/page';
import { Observable, of, map, tap} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EditorDto } from '../models/editorDto';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient) { }

  public getById(id: number): Observable<EditorDto>{
    return this.http.get<EditorDto>(`${API_URL}/editor/${id}`);
  }

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

  public getLogo(mediaId:number): Observable<any>{
    /*/return this.http.get<Blob>(`${API_URL}/media/${mediaId}/download`)/*.pipe(
      tap( // Log the result or error
      {
        next: (data) => console.log(data),
        error: (error) => console.log(error)
      }
      )
    );*/;
    /*const t = fetch(`${API_URL}/media/${mediaId}/download`).then(response => response.blob).then(blob => {
      return new File([blob], fileName+'.'+   blob.type.split('/')[1]) ;
    });*/
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/octet-stream');
    headers.append('Accept', 'application/octet-stream');
    headers.append('Content-Disposition', 'attachment');
    headers

    return this.http.get(`${API_URL}/media/${mediaId}/download`,  {headers: headers, observe:'response' as 'response', responseType: 'arraybuffer'});
  }

  public loadLogo(editorId:number, callback:(file:File, preview:string|ArrayBuffer|null|undefined)=>void) {
    this.getLogoId(editorId).subscribe(mediaId => {
      this.getLogo(mediaId).subscribe(response => {
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
