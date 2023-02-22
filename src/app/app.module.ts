import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { GamesViewComponent } from './components/games-view/games-view.component';
import { EditorsViewComponent } from './components/editors-view/editors-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddGameDialogComponent } from './components/add-game-dialog/add-game-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DrawerComponent,
    GamesViewComponent,
    EditorsViewComponent,
    AddGameDialogComponent
  ],
  imports: [
    AppRoutingModule,
    MatToolbarModule,
    BrowserModule,
    MatPaginatorModule,
    MatTableModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
