import { Component, Input } from '@angular/core';
import { Game } from 'src/app/models/Game';

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.css']
})
export class GameTileComponent {
    @Input() game!: Game;

    constructor() {}
}
