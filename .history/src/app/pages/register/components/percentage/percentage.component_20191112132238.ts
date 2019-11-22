import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { Percentage } from 'src/app/providers/models/formData.model';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent implements OnInit {

  CW = environment.CW;
  wet: string = "";

  percentage: Percentage;
  @Input() formData;
  radio_list = [
    {
      name: "측정값",
      value: "1",
      checked: "true"
    },
    {
      name: "이론값",
      value: "2",
      checked: "false"
    }
  ];

  constructor(
    private router: Router, 
    private formDataService: FormDataService
    
  ) { 
    
  }

  ionViewDidEnter(){
    this.formData = this.formDataService.getFormData();


    const b9 = this.formData.air,
    c9 = this.formData.w1_unit + this.formData.w2_unit + this.formData.w3_unit,
    d9 = this.formData.c1_unit + this.formData.c2_unit + this.formData.c3_unit,
    e9 = this.formData.mad1_unit + this.formData.mad2_unit + this.formData.mad3_unit,
    f9 = this.formData.s1_unit + this.formData.s2_unit + this.formData.s3_unit,
    g9 = this.formData.g1_unit + this.formData.g2_unit + this.formData.g3_unit,
    h9 = this.formData.ad1_unit + this.formData.ad2_unit + this.formData.ad3_unit,
    c10 = c9 / (this.formData.w1_unit/this.formData.w1_density + this.formData.w2_unit/this.formData.w2_density + this.formData.w3_unit/this.formData.w3_density),
    d10 = d9 / (this.formData.c1_unit/this.formData.c1_density + this.formData.c2_unit/this.formData.c2_density + this.formData.c3_unit/this.formData.c3_density),
    e10 = e9 / (this.formData.mad1_unit/this.formData.mad1_density + this.formData.mad2_unit/this.formData.mad2_density + this.formData.mad3_unit/this.formData.mad3_density),
    f10 = f9 / (this.formData.s1_unit/this.formData.s1_density + this.formData.s2_unit/this.formData.s2_density + this.formData.s3_unit/this.formData.s3_density),
    g10 = g9 / (this.formData.g1_unit/this.formData.g1_density + this.formData.g2_unit/this.formData.g2_density + this.formData.g3_unit/this.formData.g3_density),
    h10 = h9 / (this.formData.ad1_unit/this.formData.ad1_density + this.formData.ad2_unit/this.formData.ad2_density + this.formData.ad3_unit/this.formData.ad3_density),
    j10 = c9/c10+d9/d10+e9/e10+f9/f10+g9/g10+h9/h10+b9*10; //Vo밀도

    console.log(j10);
    this.percentage.volume = j10.toString();

    const f3 = this.formData.c1_unit || 0,
    f4 = this.formData.c2_unit || 0,
    f5 = this.formData.c3_unit || 0,
    f6 = f3+f4+f5,
    g3 = this.formData.c1_density || 1,
    g4 = this.formData.c2_density || 1,
    g5 = this.formData.c3_density || 1,
    g6 = f6/(f3/g3+f4/g4+f5/g5);
    
    this.wet = (g6+0.06).toString();
    this.percentage.wet = this.wet;

  }

  ngOnInit() {
    this.percentage = this.formDataService.getPercentage();



    /*
    const b9 = this.formData.air,
      c9 = this.formData.w1_unit + this.formData.w2_unit + this.formData.w3_unit,
      d9 = this.formData.c1_unit + this.formData.c2_unit + this.formData.c3_unit,
      e9 = this.formData.mad1_unit + this.formData.mad2_unit + this.formData.mad3_unit,
      f9 = this.formData.s1_unit + this.formData.s2_unit + this.formData.s3_unit,
      g9 = this.formData.g1_unit + this.formData.g2_unit + this.formData.g3_unit,
      h9 = this.formData.ad1_unit + this.formData.ad2_unit + this.formData.ad3_unit,
      c10 = c9 / (this.formData.w1_unit/this.formData.w1_density + this.formData.w2_unit/this.formData.w2_density + this.formData.w3_unit/this.formData.w3_density),
      d10 = d9 / (this.formData.c1_unit/this.formData.c1_density + this.formData.c2_unit/this.formData.c2_density + this.formData.c3_unit/this.formData.c3_density),
      e10 = e9 / (this.formData.mad1_unit/this.formData.mad1_density + this.formData.mad2_unit/this.formData.mad2_density + this.formData.mad3_unit/this.formData.mad3_density),
      f10 = f9 / (this.formData.s1_unit/this.formData.s1_density + this.formData.s2_unit/this.formData.s2_density + this.formData.s3_unit/this.formData.s3_density),
      g10 = g9 / (this.formData.g1_unit/this.formData.g1_density + this.formData.g2_unit/this.formData.g2_density + this.formData.g3_unit/this.formData.g3_density),
      h10 = h9 / (this.formData.ad1_unit/this.formData.ad1_density + this.formData.ad2_unit/this.formData.ad2_density + this.formData.ad3_unit/this.formData.ad3_density),
      j10 = c9/c10+d9/d10+e9/e10+f9/f10+g9/g10+h9/h10+b9*10; //Vo밀도

      this.percentage.volume = j10.toString();
    */
   
   

  }

  save(form: any): boolean {
    if (!form.valid) {
        return false;
    }
    
    this.formDataService.setPercentage(this.percentage);
    return true;
  }

  radioSelect(ev) {
    let value = ev.target.value;
    if (value == 1) {
      this.percentage.wet = this.wet;
    } else if (value == 2) {
      this.percentage.wet = this.CW;
    }
  }

  goToPrevious(form: any) {
      if (this.save(form)) {
          // Navigate to the work page
          this.router.navigate(['/register/element2']);
      }
  }

  goToNext(form: any) {
      if (this.save(form)) {
          // Navigate to the result page
          this.router.navigate(['/register/final']);
      }
  }

}
