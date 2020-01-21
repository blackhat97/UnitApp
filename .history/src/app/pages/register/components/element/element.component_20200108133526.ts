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
  wDensity: string;
  cUnit: number;
  cDensity: string;
  madUnit: number;
  madDensity: string;

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
    this.router.navigate(['/register/default']);
    /*
    if (this.save(form)) {
        this.router.navigate(['/register/default']);
    }
    */
  }

  goToNext(form: any) {
    this.router.navigate(['/register/element2']);
    /*
    if (this.save(form)) {
      this.router.navigate(['/register/element2']);
    }
    */
  }

  calc(ev) {
    let name = ev.target.name;
    let w1_unit = Number(this.element.w1_unit) || 0,
        w2_unit = Number(this.element.w2_unit) || 0,
        w3_unit = Number(this.element.w3_unit) || 0,
        c1_unit = Number(this.element.c1_unit) || 0,
        c2_unit = Number(this.element.c2_unit) || 0,
        c3_unit = Number(this.element.c3_unit) || 0,
        mad1_unit = Number(this.element.mad1_unit) || 0,
        mad2_unit = Number(this.element.mad2_unit) || 0,
        mad3_unit = Number(this.element.mad3_unit) || 0,
        w1_density = Number(this.element.w1_density) || 1,
        w2_density = Number(this.element.w2_density) || 1,
        w3_density = Number(this.element.w3_density) || 1,
        c1_density = Number(this.element.c1_density) || 1,
        c2_density = Number(this.element.c2_density) || 1,
        c3_density = Number(this.element.c3_density) || 1,
        mad1_density = Number(this.element.mad1_density) || 1,
        mad2_density = Number(this.element.mad2_density) || 1,
        mad3_density = Number(this.element.mad3_density) || 1;

    if(name == 'w1_unit' || name == 'w2_unit' || name == 'w3_unit') {
      this.wUnit = w1_unit + w2_unit + w3_unit;
    } else if(name == 'w1_density' || name == 'w2_density' || name == 'w3_density') {
      this.wDensity = (this.wUnit/(w1_unit/w1_density + w2_unit/w2_density + w3_unit/w3_density)).toFixed(3);
    } else if(name == 'c1_unit' || name == 'c2_unit' || name == 'c3_unit') {
      this.cUnit = c1_unit + c2_unit + c3_unit;
    } else if(name == 'c1_density' || name == 'c2_density' || name == 'c3_density') {
      this.cDensity = (this.cUnit/(c1_unit/c1_density + c2_unit/c2_density + c3_unit/c3_density)).toFixed(3);
    } else if(name == 'mad1_unit' || name == 'mad2_unit' || name == 'mad3_unit') {
      this.madUnit = mad1_unit + mad2_unit + mad3_unit;
    } else if(name == 'mad1_density' || name == 'mad2_density' || name == 'mad3_density') {
      this.madDensity = (this.madUnit/(mad1_unit/mad1_density + mad2_unit/mad2_density + mad3_unit/mad3_density)).toFixed(3);
    }
  }

}
