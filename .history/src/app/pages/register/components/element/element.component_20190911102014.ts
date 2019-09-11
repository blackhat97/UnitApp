import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { Element } from 'src/app/providers/models/formData.model';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {

  @Input() formData;
  element: Element;

  wUnit: number;
  wDensity: number;
  cUnit: number;
  cDensity: number;
  madUnit: number;
  madDensity: number;

  constructor(
    private router: Router,
    private formDataService: FormDataService

  ) { }

  ngOnInit() {
    this.formData = this.formDataService.getFormData();
    this.element = this.formDataService.getElement();
  }

  save(form: any): boolean {
    if (!form.valid) {
        return false;
    }
    
    this.formDataService.setElement(this.element);
    return true;
  }

  goToPrevious(form: any) {
    if (this.save(form)) {
        // Navigate to the personal page
        this.router.navigate(['/register/default']);
    }
  }

  goToNext(form: any) {
    if (this.save(form)) {
      this.router.navigate(['/register/element2']);
    }
  }

  calcWu() {
    //this.wUnit = Number(this.element.w1_unit + this.element.w2_unit + this.element.w3_unit);
    this.wUnit = 1;
  }

  calcWd() {

  }

}
