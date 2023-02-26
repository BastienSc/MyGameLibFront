import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameDialogDto } from 'src/app/models/gameDialogDto';
import { GameService } from 'src/app/services/game.service';
import { GameDto } from 'src/app/models/gameDto';
import { MediaService } from 'src/app/services/media.service';


@Component({
  selector: 'app-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.css']
})
export class GameDialogComponent implements OnInit{
  dialogType: "create" | "update";
  form: FormGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  @ViewChild('logoUpload') logoUpload!: ElementRef;

  editorList: EditorDto[] = [];
  fileList: any[] = [];
  logo: any = null;
  currentGameId: number | null;
  game!: GameDto | null;
  selectedEditor: number |null= null;

  constructor(private dialogRef: MatDialogRef<GameDialogComponent>, 
              private editorService: EditorService, 
              private mediaService: MediaService,
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
        this.getMedias();
        this.fillFormWhenUpdating();
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

  getMedias(): void{
    this.gameService.getLogoId(this.currentGameId ?? -1).subscribe(
      logoId => this.mediaService.getById(logoId[0]).subscribe(logo => {
          const headers = logo.headers.keys();
          const file = new File([logo.body], `${logo.headers.headers.get('file-name')}${logo.headers.headers.get('file-extension')}`, {type: logo.type});
          
          const reader = new FileReader();
          reader.onload = (e) => {
            this.logo = {file: file, preview: e.target?.result}
            this.form.controls['logo'].setValue(file);
          }
          reader.readAsDataURL(file);
        }
      )
    )
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
      id: this.currentGameId,
      name: gameDialog.name,
      description: gameDialog.description,
      releaseDate: gameDialog.releaseDate,
      editorId: this.form.value.editor
    }
    this.dialogRef.close({game: returnedGame, medias: this.fileList.map(f => f.file), logo: this.logo.file});
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

  onLogoSelected(event: any){
    if (event?.target?.files && event?.target?.files[0]){
      let newFile: File = event?.target?.files[0];
      
      const reader = new FileReader();

      reader.onload = (e) => {
        this.logo = {file: newFile, preview: e.target?.result};
      }
      
      reader.readAsDataURL(newFile);

      this.form.controls['logo'].setValue(newFile);
    }
    else this.form.controls['logo'].setValue('');
  }

  deleteLogo(): void{
    this.logo = null;
    this.logoUpload.nativeElement.value = null;
    this.form.controls['logo'].setValue(null);
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
      logo: new FormControl("", Validators.compose([Validators.required])),
      name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
      description: new FormControl("", Validators.compose([Validators.required])),
      releaseDate: new FormControl("", Validators.compose([Validators.required])),
      editor: new FormControl("", Validators.compose([Validators.required]))    
    });
  }
}
