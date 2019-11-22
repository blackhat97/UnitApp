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
    
  ) { }

  ngOnInit() {
    this.percentage = this.formDataService.getPercentage();

    this.formData = this.formDataService.getFormData();

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
      this.percentage.wet = 2;
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
