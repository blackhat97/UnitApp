import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { Percentage } from 'src/app/providers/models/formData.model';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent implements OnInit {

  percentage: Percentage;
  @Input() formData;

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
