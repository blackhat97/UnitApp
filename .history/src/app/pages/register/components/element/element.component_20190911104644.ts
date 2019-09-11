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

  calc(ev) {
    let name = ev.target.name;
    let w1_unit = Number(this.element.w1_unit),
        w2_unit = Number(this.element.w2_unit),
        w3_unit = Number(this.element.w3_unit),
        c1_unit = Number(this.element.c1_unit),
        c2_unit = Number(this.element.c2_unit),
        c3_unit = Number(this.element.c3_unit),
        mad1_unit = Number(this.element.mad1_unit),
        mad2_unit = Number(this.element.mad2_unit),
        mad3_unit = Number(this.element.mad3_unit),
        w1_density = Number(this.element.w1_density),
        w2_density = Number(this.element.w2_density),
        w3_density = Number(this.element.w3_density),
        c1_density = Number(this.element.c1_density),
        c2_density = Number(this.element.c2_density),
        c3_density = Number(this.element.c3_density),
        mad1_density = Number(this.element.mad1_density),
        mad2_density = Number(this.element.mad2_density),
        mad3_density = Number(this.element.mad3_density);

    if(name == 'w1_unit' || name == 'w2_unit' || name == 'w3_unit') {
      this.wUnit = w1_unit + w2_unit + w3_unit;
    } else if(name == 'w1_density' || name == 'w2_density' || name == 'w3_density') {
      this.wDensity = this.wUnit/(w1_unit/w1_density + w2_unit/w2_density + w3_unit/w3_density);

    }
  }

}
