import { Component, OnInit, ViewChild } from '@angular/core';
import { GameDto } from 'src/app/models/gameDto';
import { ViewType } from 'src/app/shared/constants';
import { MatTableDataSource } from '@angular/material/table';
import { GameService } from 'src/app/services/game.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { GameDialogComponent } from '../game-dialog/game-dialog.component';

@Component({
  selector: 'app-games-view',
  templateUrl: './games-view.component.html',
  styleUrls: ['./games-view.component.css']
})
export class GamesViewComponent implements OnInit{
  public viewType: ViewType = ViewType.list;

  displayedColumns: string[] = ['name', 'description', 'releaseDate', 'editorId'];
  dataSource: MatTableDataSource<GameDto>;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalGames = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private gameService: GameService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<GameDto>([]);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<GameDto>();
    this.dataSource.paginator = this.paginator;
    this.getGames();
  }

  openAddGameDialog(){
    const dialogRef = this.dialog.open(GameDialogComponent, {data: { dialogType: "update"}});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result == null)
        console.log("Cancelled");
      else console.log(result);
    })
  }

  searchGameByName(event: any): void{ }
  
  getGames(event: (PageEvent | null) = null) {
    this.pageSize = event?.pageSize ?? this.pageSize;
    this.pageIndex = event?.pageIndex ?? this.pageIndex;
    this.gameService.getGames(this.pageIndex, this.pageSize).subscribe(response => {
      this.dataSource.data = response.content;
      this.totalGames = response.totalElements;
    });
  }
}
