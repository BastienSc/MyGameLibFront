import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameDialogDto } from 'src/app/models/gameDialogDto';
import { GameService } from 'src/app/services/game.service';
import { GameDto } from 'src/app/models/gameDto';


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
  fileList: any[] = [];
  currentGameId: number | null;
  game!: GameDto | null;
  selectedEditor!: number;

  constructor(private dialogRef: MatDialogRef<GameDialogComponent>, 
              private editorService: EditorService, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private gameService: GameService){
    this.form = GameDialogComponent.buildForm();
    
    this.currentGameId = data?.gameId;
    this.dialogType = this.currentGameId == null ? "create" : "update";
  }

  ngOnInit(): void {
    //Si c'est un formulaire de mise à jour, il faut charger les données du jeu pour les afficher
    if (this.dialogType == "update"){
      console.log("update")
      this.gameService.getById(this.currentGameId ?? -1).subscribe(result => {
        this.game = result;
        this.fillFormWhenUpdating()
      });


    }

    this.editorService.getAllEditors()
      .subscribe(result => {
        this.editorList = result;
        this.selectedEditor = this.game?.editorId ?? -1
      }
      );
      console.log(this.game)
    
  }

  fillFormWhenUpdating(): void {
    this.form.patchValue({
      name: this.game?.name,
      description: this.game?.description,
      releaseDate: this.game?.releaseDate,
      //map les medias
    })
  }

  validate(gameDialog: any): void{
    console.log("event = ", gameDialog)
    const returnedGame = {
      name: gameDialog.name,
      description: gameDialog.description,
      releaseDate: gameDialog.releaseDate,
      editorId: this.selectedEditor
    }
    console.log(returnedGame);
    this.dialogRef.close({game: returnedGame, medias: this.fileList.map(f => f.file)});
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
