import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorDto } from 'src/app/models/editorDto';

@Component({
  selector: 'app-editor-tile',
  templateUrl: './editor-tile.component.html',
  styleUrls: ['./editor-tile.component.css']
})
export class EditorTileComponent {
  @Input() editor!: EditorDto;
  @Output() updateButtonEvent = new EventEmitter<void>();

  constructor() {}

  openEditGameDialog(){
    this.updateButtonEvent.emit()
  }
}
