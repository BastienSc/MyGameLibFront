import { Component, OnInit, ViewChild } from '@angular/core';
import { GameDto } from 'src/app/models/gameDto';
import { ViewType } from 'src/app/shared/constants';
import { MatTableDataSource } from '@angular/material/table';
import { GameService } from 'src/app/services/game.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { MediaService } from 'src/app/services/media.service';
import { Game } from 'src/app/models/Game';

@Component({
  selector: 'app-games-view',
  templateUrl: './games-view.component.html',
  styleUrls: ['./games-view.component.css']
})
export class GamesViewComponent implements OnInit{
  public viewType: ViewType = ViewType.list;

  displayedColumns: string[] = ['logo', 'name', 'description', 'releaseDate', 'editorId', 'update'];
  dataSource: MatTableDataSource<Game>;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalGames = 0;
  logos: any[] = [];
  searchTerm!: string;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private gameService: GameService, private dialog: MatDialog, private mediaService: MediaService) {
    this.dataSource = new MatTableDataSource<Game>([]);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Game>();
    this.dataSource.paginator = this.paginator;
    this.getGames();
  }

  openAddGameDialog(){
    const dialogRef = this.dialog.open(GameDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != null){
        const gameToCreate: GameDto = result.game;
        const medias: File[] = result.medias;
        const logo: File = result.logo;

        this.gameService.create(gameToCreate).subscribe(
          result => {
            gameToCreate.id = result.id;
            medias.forEach(media => {
              if (media.type.startsWith("video/"))
                this.gameService.addVideo(media, gameToCreate.id).subscribe();
              else
                this.gameService.addPicture(media, gameToCreate.id).subscribe();
            })
            this.gameService.addLogo(logo, gameToCreate.id).subscribe();
            this.getGames();
          }
        );
      }
    })
  }

  openEditGameDialog(gameId: number){
    const dialogRef = this.dialog.open(GameDialogComponent, {data: {gameId: gameId}})
  
    dialogRef.afterClosed().subscribe(result => {
      if (result != null){
        const gameToUpdate: GameDto = result.game;
        const medias: File[] = result.medias;

        this.gameService.update(gameToUpdate).subscribe(
          result => this.getGames()
        )
      }
    })
  }

  searchGameByName(): void{
    console.log(this.searchTerm)
    this.gameService.getGames(0, 5, this.searchTerm).subscribe(response => {
      this.dataSource.data = response.content.map(
        gameDto => {
          return {
            id: gameDto.id,
            name: gameDto.name, 
            description: gameDto.description,
            releaseDate: gameDto.releaseDate,
            editorId: gameDto.editorId,
            logo: null
          }
        }
      );
      this.totalGames = response.totalElements;
      this.getLogos();
    });
  }
  
  getGames(event: (PageEvent | null) = null) {
    this.pageSize = event?.pageSize ?? this.pageSize;
    this.pageIndex = event?.pageIndex ?? this.pageIndex;
    this.gameService.getGames(this.pageIndex, this.pageSize).subscribe(response => {
      this.dataSource.data = response.content.map(
        gameDto => {
          return {
            id: gameDto.id,
            name: gameDto.name, 
            description: gameDto.description,
            releaseDate: gameDto.releaseDate,
            editorId: gameDto.editorId,
            logo: null
          }
        }
      );
      this.totalGames = response.totalElements;
      this.getLogos();
    });
  }

  getLogos(): void{
    console.log(this.dataSource.data)
    this.dataSource.data.forEach(
      game => this.gameService.getLogoId(game.id).subscribe(logoId => {
          this.mediaService.getById(logoId[0]).subscribe(logo => {
          const headers = logo.headers.keys();
          console.log(logo)
          const file = new File([logo.body], `${logo.headers.headers.get('file-name')}${logo.headers.headers.get('file-extension')}`, {type: logo.type});
          
          const reader = new FileReader();
          reader.onload = (e) => {
            game.logo = e.target?.result;
          }
          reader.readAsDataURL(file);
        })
      })
    )
  }

  navigateTo(e: any): void{
    ;
  }
}
