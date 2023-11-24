import { Component, OnInit } from "@angular/core";
import { IDeck } from "../models/deck";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DeckService } from "../services/deck.service";

@Component({
  selector: "app-deck-component",
  templateUrl: "./deck.component.html"
})

export class DeckComponent implements OnInit{
  viewTitle: string = "Table";
  private _listFilter: string = "";
  decks: IDeck[] = [];

  // injecting the HttpClient service into the component
  constructor(
    private _router: Router,
  private _deckService: DeckService) {}

  get listFilter() {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log("In setter: ", value);
    this.filteredDecks = this.performFilter(value);
  }

  deleteDeck(deck: IDeck): void {
    const confirmDelete = confirm(`Are you sure you want to delete deck #${deck.DeckId}?`);

    if (confirmDelete) {
      this._deckService.deleteItem(deck.DeckId)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this.filteredDecks = this.filteredDecks.filter(f => f !== deck);
          }
        },
          (error) => {
            console.log("Error deleting item:", error);
          });
    }
  }

  getDecks(): void {
    // call to the server with the url "api/item/", expected return type is an IDeck array. This is also an observable return by the get
    this._deckService.getDecks()
      .subscribe(data => { // subscribe() used to receive the data when the response is received 
        console.log("All", JSON.stringify(data));
        this.decks = data;
        this.filteredDecks = this.decks;
      });
  }

  filteredDecks: IDeck[] = this.decks;
  performFilter(filterBy: string): IDeck[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.decks.filter((deck: IDeck) =>
      deck.DeckName.toLocaleLowerCase().includes(filterBy));
  }

  navigateToDeckform() {
    this._router.navigate(["/deckform"]);
  }

  ngOnInit(): void {
    console.log("DeckComponent created");
    this.getDecks();
    console.log("getDecks() called from oninit!")
  }
}
