import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { EditorDto } from 'src/app/models/editorDto';
import { EditorService } from 'src/app/services/editor.service';


@Component({
  selector: 'app-add-game-dialog',
  templateUrl: './add-game-dialog.component.html',
  styleUrls: ['./add-game-dialog.component.css']
})
export class AddGameDialogComponent implements OnInit{
  form: FormGroup;
  editorList: EditorDto[] = [];

  constructor(private dialogRef: MatDialogRef<AddGameDialogComponent>, private editorService: EditorService){
    this.form = AddGameDialogComponent.buildForm();
  }

  ngOnInit(): void {
    this.editorService.getAllEditors()
      .subscribe(
        result => this.editorList = result
      );
  }


  validate(): void{
    this.dialogRef.close("Validation");
  }

  cancel(): void{
    this.dialogRef.close();
  }

  /**
   * Fonction pour construire notre formulaire
   * @returns {FormGroup}
   *
   * @private
   */
  private static buildForm(): FormGroup {
    return new FormGroup({
      nom: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
      description: new FormControl("", Validators.compose([Validators.required])),
      releaseDate: new FormControl("", Validators.compose([Validators.required]))
    });
  }
}
