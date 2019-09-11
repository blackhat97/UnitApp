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
    
  }

}
