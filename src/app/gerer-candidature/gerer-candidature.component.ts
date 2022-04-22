import { Component, OnInit } from '@angular/core';
import { Candidature } from './candidature';
import { CandidatureService } from './candidature.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gerer-candidature',
  templateUrl: './gerer-candidature.component.html',
  styleUrls: ['./gerer-candidature.component.css']
})
export class GererCandidatureComponent implements OnInit {

  public candidatures: Candidature[];
  public editCandidature: Candidature;
  public deleteCandidature: Candidature;
  
 
  constructor(private candidatureService: CandidatureService,public router: Router){}

  ngOnInit() {
    this.getCandidatures();

  }

  public getCandidatures(): void {
    this.candidatureService.getCandidatures().subscribe(
      (response: Candidature[]) => {
        this.candidatures = response;
        console.log(this.candidatures);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddCandidature(addForm: NgForm): void {
    document.getElementById('add-candidature-form').click();
    this.candidatureService.addCandidature(addForm.value).subscribe(
      (response: Candidature) => {
        console.log(response);
        this.getCandidatures();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateCandidature(candidature: Candidature): void {
    this.candidatureService.updateCandidature(candidature).subscribe(
      (response: Candidature) => {
        console.log(response);
        this.getCandidatures();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteCandidature(candidatureId: number): void {
    this.candidatureService.deleteCandidature(candidatureId).subscribe(
      (response: void) => {
        console.log(response);
        this.getCandidatures();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchCandidatures(key: string): void {
    console.log(key);
    const results: Candidature[] = [];
    for (const candidature of this.candidatures) {
      if (candidature.nom.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || candidature.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || candidature.prenom.toLowerCase().indexOf(key.toLowerCase()) !== -1
      
      ) {
        results.push(candidature);
      }
    }
    this.candidatures = results;
    if (results.length === 0 || !key) {
      this.getCandidatures();
    }
  }

  public onOpenModal(candidature: Candidature, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCandidatureModal');
    }
    if (mode === 'edit') {
      this.editCandidature = candidature;
      button.setAttribute('data-target', '#updateCandidatureModal');
    }
    if (mode === 'delete') {
      this.deleteCandidature = candidature;
      button.setAttribute('data-target', '#deleteCandidatureModal');
    }
    container.appendChild(button);
    button.click();
  }



}