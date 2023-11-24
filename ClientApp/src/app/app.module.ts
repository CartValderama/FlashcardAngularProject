import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { FolderComponent } from "./folder/folder.component";
import { FolderformComponent } from "./folder/folderform.component";

import { DeckComponent } from "./deck/deck.component"; 
import { DeckformComponent } from "./deck/deckform.component";

import { FlashcardComponent } from "./flashcard/flashcard.component";
import { FlashcardformComponent } from "./flashcard/flashcardform.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    FolderComponent,
    FolderformComponent,
    DeckComponent,
    DeckformComponent,
    FlashcardComponent,
    FlashcardformComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: "folder", component: FolderComponent },
      { path: "folderform", component: FolderformComponent },
      { path: "folderform/:mode/:id", component: FolderformComponent },
      { path: "deck", component: DeckComponent },
      { path: "deckform", component: DeckformComponent },
      { path: "deckform/:mode/:id", component: DeckformComponent },
      { path: "flashcard", component: FlashcardComponent },
      { path: "flashcardform", component: FlashcardformComponent },
      { path: "flashcardform/:mode/:id", component: FlashcardformComponent },
      {path: "**", redirectTo: "", pathMatch: "full"}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
