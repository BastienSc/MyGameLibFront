import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorsViewComponent } from './components/editors-view/editors-view.component';
import { GamesViewComponent } from './components/games-view/games-view.component';

const routes: Routes = [
  {
    path: 'games',
    component: GamesViewComponent
  },
  {
    path: "editors",
    component: EditorsViewComponent
  },
  
  {
    path: '**',
    redirectTo: 'games'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
