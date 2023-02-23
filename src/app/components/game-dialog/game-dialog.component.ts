import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameDialogDto } from 'src/app/models/gameDialogDto';


@Component({
  selector: 'app-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.css']
})
export class GameDialogComponent implements OnInit{
  dialogType: "create" | "update";
  form: FormGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  editorList: EditorDto[] = [];
  selectedEditor!: EditorDto;
  fileList: any[] = [];
  game!: GameDialogDto | null;

  constructor(private dialogRef: MatDialogRef<GameDialogComponent>, 
              private editorService: EditorService, 
              @Inject(MAT_DIALOG_DATA) public data: any){
    this.form = GameDialogComponent.buildForm();
    
    const gameToUpdate = data?.game;
    if (gameToUpdate == null)
      this.dialogType = "create";
    else{
      this.dialogType = "update";
      this.game = data.game;
      this.selectedEditor = data?.game?.editor;
    }
  }

  ngOnInit(): void {
    this.editorService.getAllEditors()
      .subscribe(
        result => this.editorList = result
      );
    this.form.patchValue({
      name: this.game?.name,
      description: this.game?.description,
      releaseDate: this.game?.releaseDate,
      //map les medias
    })
  }


  validate(gameDialog: GameDialogDto): void{
    gameDialog.medias = this.fileList.map(f => f.file);
    console.log(gameDialog)
    this.dialogRef.close(this.dialogType);
  }

  cancel(): void{
    this.dialogRef.close();
  }

  onFileSelected(event: any){
    if (event?.target?.files && event?.target?.files[0]){
      let newFile: File = event?.target?.files[0];
      
      const reader = new FileReader();


      reader.onload = (e) => {
        this.fileList.push({file: newFile, preview: e.target?.result});
      }
      
      reader.readAsDataURL(newFile);
    }
  }

  deleteFile(file: any){
    const fileIndex = this.fileList.indexOf(file);
    if (fileIndex > -1)
      this.fileList.splice(fileIndex, 1);

    console.log(fileIndex, this.fileList)
  }

  isImage(file: File | null): boolean{
    return file?.type.startsWith("image/") ?? false;
  }

  isVideo(file: File | null): boolean{
    return file?.type.startsWith("video/") ?? false;
  }

  changeEditor(event: any){
    this.selectedEditor = event;
  }

  /**
   * Fonction pour construire notre formulaire
   * @returns {FormGroup}
   *
   * @private
   */
  private static buildForm(): FormGroup {
    return new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
      description: new FormControl("", Validators.compose([Validators.required])),
      releaseDate: new FormControl("", Validators.compose([Validators.required])),
      editor: new FormControl("", Validators.compose([]))    
    });
  }
}
