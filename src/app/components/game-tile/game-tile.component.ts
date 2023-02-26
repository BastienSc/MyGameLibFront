import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.css']
})
export class GameTileComponent {
    @Input() game!: Game;
    @Output() updateButtonEvent = new EventEmitter<void>();

    constructor() {}

    openEditGameDialog(){
      this.updateButtonEvent.emit()
    }
}
