import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FolderService } from "../services/folder.service";

@Component({
  selector: "app-folder-folderform",
  templateUrl: "./folderform.component.html"
})

export class FolderformComponent {
  folderForm: FormGroup;
  isEditMode: boolean = false;
  folderId: number = -1;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _folderService: FolderService)
  {
    this.folderForm = _formbuilder.group({
      folderName: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(/[0-9a-zA-ZæøåÆØÅ. \-]{2,15}/)
      ]],
      folderDescription: ["", [Validators.maxLength(150)]],
    })
  }

  onSubmit() {
    console.log("FolderCreate form submitted:");
    console.log(this.folderForm);
    console.log("The folder " + this.folderForm.value.folderName + " is created.");
    console.log(this.folderForm.touched);
    const newFolder = this.folderForm.value;
    const createUrl = "api/item/create";
    if (this.isEditMode) {
      this._folderService.updateFolder(this.folderId, newFolder)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/folder"]);
          }
          else {
            console.log("Folder update failed");
          }
        })
    }
    else {
      this._folderService.createFolder(newFolder)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(["/folder"]);
          }
          else {
            console.log("Folder creation failed");
          }
        });
    };
  }

  backToFolders() {
    this._router.navigate(["/folder"]);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params["mode"] === "create") {
        this.isEditMode = false; // Create mode
      } else if (params["mode"] === "edit") {
        this.isEditMode = true; // Edit mode
        this.folderId = +params["id"];
        this.loadItemForEdit(this.folderId);
      }
    });
  }

  loadItemForEdit(folderId: number) {
    this._folderService.getFolderById(folderId)
      .subscribe(
        (folder: any) => {
          console.log("retrived folder: ", folder);
          this.folderForm.patchValue({
            folderName: folder.FolderName,
            folderDescription: folder.FolderDescription
          });
        },
        (error: any) => {
          console.error("Error loading folder for edit: ", error);
        }
      );
  }
}
