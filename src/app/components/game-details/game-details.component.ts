import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditorDto } from 'src/app/models/editorDto';
import { GameDto } from 'src/app/models/gameDto';
import { EditorService } from 'src/app/services/editor.service';
import { GameService } from 'src/app/services/game.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent {
    game!: GameDto;
    gameId!: number;
    logo: any;
    pictures: any[] = [];
    videos: any[] = [];
    editor!: EditorDto;

    constructor(private _route: ActivatedRoute, 
      private mediaService: MediaService, 
      private gameService: GameService,
      private editorService: EditorService){}

    ngOnInit(){
      this.gameId = parseInt(this._route.snapshot.paramMap.get('id') ?? '-1');

      this.gameService.getById(this.gameId).subscribe(
        game => this.game = game
      );
      
      this.getLogo();
      this.getPictures();
      this.getVideos();
      this.editorService.getById(this.gameId).subscribe(editor => this.editor = editor);
    }

    private getLogo(): void{
      this.gameService.getLogoId(this.gameId).subscribe(
        logoId => {
          this.mediaService.getById(logoId[0]).subscribe(
            logo => {
              const headers = logo.headers.keys();
              const file = new File([logo.body], `${logo.headers.headers.get('file-name')}${logo.headers.headers.get('file-extension')}`, {type: logo.type});
              
              const reader = new FileReader();
              reader.onload = (e) => {
                this.logo = e.target?.result;
              }
              reader.readAsDataURL(file);
            }
          )
        }
      );
    }

    private getPictures(): void {
      this.pictures = [];
      this.gameService.getPicturesId(this.gameId).subscribe(picturesIds => {
        picturesIds.forEach(
          pictureId => this.mediaService.getById(pictureId).subscribe(picture => {
              const headers = picture.headers.keys();
              const file = new File([picture.body], `${picture.headers.headers.get('file-name')}${picture.headers.headers.get('file-extension')}`, {type: picture.type});
              
              const reader = new FileReader();
              reader.onload = (e) => {
                this.pictures.push(e.target?.result);
              }
              reader.readAsDataURL(file);
          })
        )
      })
    }

    private getVideos(): void {
      this.gameService.getVideosId(this.gameId).subscribe(videosIds => {
        videosIds.forEach(
          videoId => this.mediaService.getById(videoId).subscribe(video => {
              const headers = video.headers.keys();
              const file = new File([video.body], `${video.headers.headers.get('file-name')}${video.headers.headers.get('file-extension')}`, {type: video.type});
              
              const reader = new FileReader();
              reader.onload = (e) => {
                this.videos.push(e.target?.result);
              }
              reader.readAsDataURL(file);
          })
        )
      })
    }
}
