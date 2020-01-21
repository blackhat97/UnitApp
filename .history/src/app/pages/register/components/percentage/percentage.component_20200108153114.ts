import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { Percentage } from 'src/app/providers/models/formData.model';
import { environment } from 'src/environments/environment.prod';
import { FormulaService } from 'src/app/providers/services/formula.service';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent implements OnInit {

  wet: string = "";
  volume: number = 0;

  percentage: Percentage;
  @Input() formData;
  radio_list = [
    {
      name: "측정값",
      value: "1",
      checked: "false"
    },
    {
      name: "이론값",
      value: "2",
      checked: "true"
    }
  ];

  constructor(
    private router: Router, 
    private formDataService: FormDataService,
    public formula: FormulaService
    
  ) { 
    
  }

  ionViewDidEnter(){
    this.formData = this.formDataService.getFormData();

    this.wet = this.formula.cementWet(this.formData);
    //this.percentage.wet = this.wet;

    this.percentage.volume = this.formula.theoryVolume(this.formData, 0);
    
    this.volume = Number(this.percentage.volume)/1000;
    console.log(typeof(this.percentage.volume));

  }

  ngOnInit() {
    this.percentage = this.formDataService.getPercentage();
  }

  save(form: any): boolean {
    /*
    if (!form.valid) {
        return false;
    }
    */
    
    this.formDataService.setPercentage(this.percentage);
    return true;
  }

  radioSelect(ev) {
    let value = ev.target.value;
    if (value == 1) {
      console.log('select 1');
    } else if (value == 2) {
      this.percentage.wet = this.wet;
    }
  }

  goToPrevious(form: any) {
    if (this.save(form)) {
      this.router.navigate(['/register/element2']);
    }
  }

  goToNext(form: any) {
      if (this.save(form)) {
        this.router.navigate(['/register/final']);
      }
  }


  ionBlur() {
    this.percentage.volume = this.formula.theoryVolume(this.formData, Number(this.percentage.air));
  }

}
