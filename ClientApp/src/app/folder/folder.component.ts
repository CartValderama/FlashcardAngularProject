import { Component, OnInit } from "@angular/core";
import { IFolder } from "../models/folder";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { FolderService } from "../services/folder.service";

@Component({
  selector: "app-folder-component",
  templateUrl: "./folder.component.html"
})

export class FolderComponent implements OnInit{
  viewTitle: string = "Table";
  private _listFilter: string = "";
  folders: IFolder[] = [];

  // injecting the HttpClient service into the component
  constructor(
    private _router: Router,
  private _folderService: FolderService) {}

  get listFilter() {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log("In setter: ", value);
    this.filteredFolders = this.performFilter(value);
  }

  deleteFolder(folder: IFolder): void {
    const confirmDelete = confirm(`Are you sure you want to delete folder #${folder.FolderId}?`);

    if (confirmDelete) {
      this._folderService.deleteItem(folder.FolderId)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this.filteredFolders = this.filteredFolders.filter(f => f !== folder);
          }
        },
          (error) => {
            console.log("Error deleting item:", error);
          });
    }
  }

  getFolders(): void {
    // call to the server with the url "api/item/", expected return type is an IFolder array. This is also an observable return by the get
    this._folderService.getFolders()
      .subscribe(data => { // subscribe() used to receive the data when the response is received 
        console.log("All", JSON.stringify(data));
        this.folders = data;
        this.filteredFolders = this.folders;
      });
  }

  filteredFolders: IFolder[] = this.folders;
  performFilter(filterBy: string): IFolder[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.folders.filter((folder: IFolder) =>
      folder.FolderName.toLocaleLowerCase().includes(filterBy));
  }

  navigateToFolderform() {
    this._router.navigate(["/folderform"]);
  }

  ngOnInit(): void {
    console.log("FolderComponent created");
    this.getFolders();
    console.log("getFolders() called from oninit!")
  }
}
