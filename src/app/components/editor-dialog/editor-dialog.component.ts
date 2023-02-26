import { Component, ElementRef, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.css']
})
export class EditorDialogComponent implements OnInit {
  dialogType: "create" | "update";
  form: FormGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  file: any;
  currentEditorId: number | null;
  editor!: EditorDto|null;

  constructor(private dialogRef: MatDialogRef<EditorDialogComponent>,
              private editorService:EditorService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)]))
    });
    this.currentEditorId = data?.editorId;
    this.dialogType = this.currentEditorId == null ? "create" : "update";
  }

  ngOnInit(): void {
    if (this.dialogType == "update" && this.currentEditorId !== null){
      this.editorService.getById(this.currentEditorId).subscribe(result => {
        this.editor = result;
        this.form.patchValue({
          name: this.editor?.name
        })
      });
      this.editorService.loadLogo(this.currentEditorId, (file, preview) => {this.file = {file: file, preview:preview};});
    }
  }

  onFileSelected(event: any){
    if (event?.target?.files && event?.target?.files[0]){
      let newFile: File = event?.target?.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.file = {file: newFile, preview: e.target?.result};
      }
      reader.readAsDataURL(newFile);
    }
  }

  deleteFile() {
    this.file = null;
    this.fileUpload.nativeElement.value = ""; // making it so that the input element for the file is reset (otherwise the name of the removed file stays)
  }

  validate(editorDialog: any): void{
    const returnedEditor = {
      name: editorDialog.name
    }
    // returning result
    this.dialogRef.close({editor: returnedEditor, media: this.file?.file});
  }

  cancel(): void{
    this.dialogRef.close();
  }
}
