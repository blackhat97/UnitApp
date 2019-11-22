import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { Element2 } from 'src/app/providers/models/formData.model';

@Component({
  selector: 'app-element2',
  templateUrl: './element2.component.html',
  styleUrls: ['./element2.component.scss']
})
export class Element2Component implements OnInit {

  @Input() formData;
  element2: Element2;

  sUnit: number;
  sDensity: string;
  gUnit: number;
  gDensity: string;
  adUnit: number;
  adDensity: string;

  constructor(
    private router: Router,
    private formDataService: FormDataService
  ) { }

  ngOnInit() {
    this.formData = this.formDataService.getFormData();
    this.element2 = this.formDataService.getElement2();

  }

  save(form: any): boolean {
    if (!form.valid) {
        return false;
    }
    
    this.formDataService.setElement2(this.element2);
    return true;
  }

  goToPrevious(form: any) {
    if (this.save(form)) {
        // Navigate to the personal page
        this.router.navigate(['/register/element']);
    }
  }

  goToNext(form: any) {
    if(this.save(form)) {
    this.router.navigate(['/register/percentage']);
    }
  }

  calc(ev) {
    let name = ev.target.name;
    let s1_unit = Number(this.element2.s1_unit) || 0,
        s2_unit = Number(this.element2.s2_unit) || 0,
        s3_unit = Number(this.element2.s3_unit) || 0,
        g1_unit = Number(this.element2.g1_unit) || 0,
        g2_unit = Number(this.element2.g2_unit) || 0,
        g3_unit = Number(this.element2.g3_unit) || 0,
        ad1_unit = Number(this.element2.ad1_unit) || 0,
        ad2_unit = Number(this.element2.ad2_unit) || 0,
        ad3_unit = Number(this.element2.ad3_unit) || 0,
        s1_density = Number(this.element2.s1_density) || 1,
        s2_density = Number(this.element2.s2_density) || 1,
        s3_density = Number(this.element2.s3_density) || 1,
        g1_density = Number(this.element2.g1_density) || 1,
        g2_density = Number(this.element2.g2_density) || 1,
        g3_density = Number(this.element2.g3_density) || 1,
        ad1_density = Number(this.element2.ad1_density) || 1,
        ad2_density = Number(this.element2.ad2_density) || 1,
        ad3_density = Number(this.element2.ad3_density) || 1;
        
    if(name == 's1_unit' || name == 's2_unit' || name == 's3_unit') {
      this.sUnit = s1_unit + s2_unit + s3_unit;
    } else if(name == 's1_density' || name == 's2_density' || name == 's3_density') {
      this.sDensity = (this.sUnit/(s1_unit/s1_density + s2_unit/s2_density + s3_unit/s3_density)).toFixed(2);
    } else if(name == 'g1_unit' || name == 'g2_unit' || name == 'g3_unit') {
      this.gUnit = g1_unit + g2_unit + g3_unit;
    } else if(name == 'g1_density' || name == 'g2_density' || name == 'g3_density') {
      this.gDensity = (this.gUnit/(g1_unit/g1_density + g2_unit/g2_density + g3_unit/g3_density)).toFixed(2);
    } else if(name == 'ad1_unit' || name == 'ad2_unit' || name == 'ad3_unit') {
      this.adUnit = ad1_unit + ad2_unit + ad3_unit;
    } else if(name == 'ad1_density' || name == 'ad2_density' || name == 'ad3_density') {
      this.adDensity = (this.adUnit/(ad1_unit/ad1_density + ad2_unit/ad2_density + ad3_unit/ad3_density)).toFixed(2);
    }
  }

}
