import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActualiteService } from './actualite.service';
import { Actualite } from './actualite';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gerer-actualite',
  templateUrl: './gerer-actualite.component.html',
  styleUrls: ['./gerer-actualite.component.css']
})
export class GererActualiteComponent implements OnInit {

  public actualites: Actualite[];
  public editActualite: Actualite;
  public deleteActualite: Actualite;
  private roles: string[];
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false;
  constructor(private actualiteService: ActualiteService,private tokenStorageService: TokenStorageService,public router:Router){}

  ngOnInit() {
    this.getActualites();
    const user = this.tokenStorageService.getUser();
    if(user!=null){
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.showUserBoard= this.roles.includes('ROLE_USER');
    }
  }

  public getActualites(): void {
    this.actualiteService.getActualites().subscribe(
      (response: Actualite[]) => {
        this.actualites = response;
        console.log(this.actualites);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddActualite(addForm: NgForm): void {
    
    document.getElementById('add-actualite-form').click();
    this.actualiteService.addActualite(addForm.value).subscribe(
      (response: Actualite) => {
        console.log(response);
        this.getActualites();
        addForm.reset();
       
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateActualite(actualite: Actualite): void {
    this.actualiteService.updateActualite(actualite).subscribe(
      (response: Actualite) => {
        console.log(response);
        this.getActualites();
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteActualite(actualiteId: number): void {
    this.actualiteService.deleteActualite(actualiteId).subscribe(
      (response: void) => {
        console.log(response);
        this.getActualites();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchActualites(key: string): void {
    console.log(key);
    const results: Actualite[] = [];
    for (const actualite of this.actualites) {
      if (actualite.titre.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || actualite.message.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(actualite);
      }
    }
    this.actualites = results;
    if (results.length === 0 || !key) {
      this.getActualites();
    }
  }

  public onOpenModal(actualite: Actualite, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addActualiteModal');
    }
    if (mode === 'edit') {
      this.editActualite = actualite;
      button.setAttribute('data-target', '#updateActualiteModal');
    }
    if (mode === 'delete') {
      this.deleteActualite = actualite;
      button.setAttribute('data-target', '#deleteActualiteModal');
    }
    container.appendChild(button);
    button.click();
  }



}