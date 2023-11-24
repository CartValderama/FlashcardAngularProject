import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DeckService } from "../services/deck.service";

@Component({
  selector: "app-deck-deckform",
  templateUrl: "./deckform.component.html"
})

export class DeckformComponent {
  deckForm: FormGroup;
  isEditMode: boolean = false;
  deckId: number = -1;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _deckService: DeckService)
  {
    this.deckForm = _formbuilder.group({
      deckName: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(/[0-9a-zA-ZæøåÆØÅ. \-]{2,15}/)
      ]],
      deckDescription: ["", [Validators.maxLength(150)]],
      FolderId: [null]
    })
  }

  onSubmit() {
    console.log("DeckCreate form submitted:");
    console.log(this.deckForm);
    console.log("The deck " + this.deckForm.value.deckName + " is created.");
    console.log(this.deckForm.touched);
    const newDeck = this.deckForm.value;
    const createUrl = "api/item/create";
    if (this.isEditMode) {
      this._deckService.updateDeck(this.deckId, newDeck)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/deck"]);
          }
          else {
            console.log("Deck update failed");
          }
        })
    }
    else {
      this._deckService.createDeck(newDeck)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/deck"]);
          }
          else {
            console.log("Deck creation failed");
          }
        });
    };
  }

  backToDecks() {
    this._router.navigate(["/deck"]);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params["mode"] === "create") {
        this.isEditMode = false; // Create mode
      } else if (params["mode"] === "edit") {
        this.isEditMode = true; // Edit mode
        this.deckId = +params["id"];
        this.loadItemForEdit(this.deckId);
      }
    });
  }

  loadItemForEdit(deckId: number) {
    this._deckService.getDeckById(deckId)
      .subscribe(
        (deck: any) => {
          console.log("retrived deck: ", deck);
          this.deckForm.patchValue({
            deckName: deck.DeckName,
            deckDescription: deck.DeckDescription
          });
        },
        (error: any) => {
          console.error("Error loading deck for edit: ", error);
        }
      );
  }
}
