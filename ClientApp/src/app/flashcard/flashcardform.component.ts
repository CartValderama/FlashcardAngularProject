import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FlashcardService } from "../services/flashcard.service";

@Component({
  selector: "app-flashcard-flashcardform",
  templateUrl: "./flashcardform.component.html"
})

export class FlashcardformComponent {
  flashcardForm: FormGroup;
  isEditMode: boolean = false;
  flashcardId: number = -1;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _flashcardService: FlashcardService)
  {
    this.flashcardForm = _formbuilder.group({
      Question: ["", [
        Validators.required,
        Validators.maxLength(90)
      ]],
      Answer: ["", [
        Validators.required,
        Validators.maxLength(90)
      ]],
    })
  }

  onSubmit() {
    console.log("FlashcardCreate form submitted:");
    console.log(this.flashcardForm);
    console.log("The flashcard " + this.flashcardForm.value.flashcardName + " is created.");
    console.log(this.flashcardForm.touched);
    const newFlashcard = this.flashcardForm.value;
    const createUrl = "api/item/create";
    if (this.isEditMode) {
      this._flashcardService.updateFlashcard(this.flashcardId, newFlashcard)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/flashcard"]);
          }
          else {
            console.log("Flashcard update failed");
          }
        })
    }
    else {
      this._flashcardService.createFlashcard(newFlashcard)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/flashcard"]);
          }
          else {
            console.log("Flashcard creation failed");
          }
        });
    };
  }

  backToFlashcards() {
    this._router.navigate(["/flashcard"]);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params["mode"] === "create") {
        this.isEditMode = false; // Create mode
      } else if (params["mode"] === "edit") {
        this.isEditMode = true; // Edit mode
        this.flashcardId = +params["id"];
        this.loadItemForEdit(this.flashcardId);
      }
    });
  }

  loadItemForEdit(flashcardId: number) {
    this._flashcardService.getFlashcardById(flashcardId)
      .subscribe(
        (flashcard: any) => {
          console.log("retrived flashcard: ", flashcard);
          this.flashcardForm.patchValue({
            flashcardName: flashcard.FlashcardName,
            flashcardDescription: flashcard.FlashcardDescription
          });
        },
        (error: any) => {
          console.error("Error loading flashcard for edit: ", error);
        }
      );
  }
}
