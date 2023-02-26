import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';
import { ViewType } from 'src/app/shared/constants';
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';

@Component({
  selector: 'app-editors-view',
  templateUrl: './editors-view.component.html',
  styleUrls: ['./editors-view.component.css']
})
export class EditorsViewComponent implements OnInit {
  public viewType: ViewType = ViewType.list;

  displayedColumns: string[] = ['logo', 'name', 'update'];
  dataSource: MatTableDataSource<EditorDto>;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalEditors = 0;

  view:string;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private editorService:EditorService, private dialog:MatDialog) {
    this.dataSource = new MatTableDataSource<EditorDto>([]);
    this.view = 'list';
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<EditorDto>();
    this.dataSource.paginator = this.paginator;
    this.getEditors();
  }

  openDialog(editorId:number|null = null) {
    const dialogRef = this.dialog.open(EditorDialogComponent, (editorId ? {data: {editorId:editorId}} : {data:{}}) );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const resultEditor: EditorDto = result.editor;
        const media: File = result.media;
        let observable: Observable<EditorDto>;
        //
        if (editorId === null) {
          observable = this.editorService.create(resultEditor);;
        } else {
          observable = this.editorService.update(editorId, resultEditor);
        }
        //
        observable.subscribe(result => {
          editorId = editorId ? editorId : result.id;
          if (media) {
            const formData = new FormData();
            formData.append('file', media);
            this.editorService.addLogo(editorId, formData).subscribe(() => {
              this.getEditors();
            })
          } else {
            this.getEditors();
          }
        });
      }
    });
  }

  addEditor() {
    this.openDialog();
  }

  editEdior(editorId:number) {
    this.openDialog(editorId);
  }

  getEditors(event: (PageEvent | null) = null) {
    this.pageSize = event?.pageSize ?? this.pageSize;
    this.pageIndex = event?.pageIndex ?? this.pageIndex;
    this.editorService.getPaginatedEditors(this.pageIndex, this.pageSize).subscribe(response => {
      this.dataSource.data = response.content;
      for (let i = 0; i < this.dataSource.data.length; i++) {
        const element = this.dataSource.data[i];
        this.editorService.loadLogo(element.id, (file, preview) => {
          this.dataSource.data[i].logo = preview;
        })
      }
      console.log(this.dataSource.data);
      this.totalEditors = response.totalElements;
    });
  }

  switchView() {
    this.view = (this.view == 'list') ? 'card' : 'list';
  }
}
