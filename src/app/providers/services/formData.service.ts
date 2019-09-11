import { Injectable }                        from '@angular/core';

import { FormData, Personal, Element, Element2, Percentage }       from '../models/formData.model';
import { WorkflowService }                   from '../workflow/workflow.service';
import { STEPS }                             from '../workflow/workflow.model';

@Injectable()
export class FormDataService {

    private formData: FormData = new FormData();
    private isPersonalFormValid: boolean = false;
    private isElementFormValid: boolean = false;
    private isElement2FormValid: boolean = false;
    private isPercentageFormValid: boolean = false;

    constructor(private workflowService: WorkflowService) { 

    }

    getPersonal(): Personal {
        // Return the Personal data
        var personal: Personal = {
            mixnum: this.formData.mixnum,
            company: this.formData.company,
            contractor: this.formData.contractor,
            site: this.formData.site
        };
        return personal;
    }

    setPersonal(data: Personal) {
        // Update the Personal data only when the Personal Form had been validated successfully
        this.isPersonalFormValid = true;
        this.formData.mixnum = data.mixnum;
        this.formData.company = data.company;
        this.formData.contractor = data.contractor;
        this.formData.site = data.site;

        // Validate Personal Step in Workflow
        this.workflowService.validateStep(STEPS.personal);
    }

    getElement() : Element {
        // Return the Address data
        var element: Element = {
            w1_unit: this.formData.w1_unit,
            w2_unit: this.formData.w2_unit,
            w3_unit: this.formData.w3_unit,
            c1_unit: this.formData.c1_unit,
            c2_unit: this.formData.c2_unit,
            c3_unit: this.formData.c3_unit,
            mad1_unit: this.formData.mad1_unit,
            mad2_unit: this.formData.mad2_unit,
            mad3_unit: this.formData.mad3_unit,

            w1_density: this.formData.w1_density,
            w2_density: this.formData.w2_density,
            w3_density: this.formData.w3_density,
            c1_density: this.formData.c1_density,
            c2_density: this.formData.c2_density,
            c3_density: this.formData.c3_density,
            mad1_density: this.formData.mad1_density,
            mad2_density: this.formData.mad2_density,
            mad3_density: this.formData.mad3_density

        };
        return element;
    }

    setElement(data: Element) {
        // Update the Address data only when the Address Form had been validated successfully
        this.isElementFormValid = true;
        this.formData.w1_unit = data.w1_unit;
        this.formData.w2_unit = data.w2_unit;
        this.formData.w3_unit = data.w3_unit;
        this.formData.c1_unit = data.c1_unit;
        this.formData.c2_unit = data.c2_unit;
        this.formData.c3_unit = data.c3_unit;
        this.formData.mad1_unit = data.mad1_unit;
        this.formData.mad2_unit = data.mad2_unit;
        this.formData.mad3_unit = data.mad3_unit;
        
        this.formData.w1_density = data.w1_density;
        this.formData.w2_density = data.w2_density;
        this.formData.w3_density = data.w3_density;
        this.formData.c1_density = data.c1_density;
        this.formData.c2_density = data.c2_density;
        this.formData.c3_density = data.c3_density;
        this.formData.mad1_density = data.mad1_density;
        this.formData.mad2_density = data.mad2_density;
        this.formData.mad3_density = data.mad3_density;
        

        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.element);
    }

    getElement2() : Element2 {
        // Return the Address data
        var element2: Element2 = {
            s1_unit: this.formData.s1_unit,
            s2_unit: this.formData.s2_unit,
            s3_unit: this.formData.s3_unit,
            g1_unit: this.formData.g1_unit,
            g2_unit: this.formData.g2_unit,
            g3_unit: this.formData.g3_unit,
            ad1_unit: this.formData.ad1_unit,
            ad2_unit: this.formData.ad2_unit,
            ad3_unit: this.formData.ad3_unit,

            s1_density: this.formData.s1_density,
            s2_density: this.formData.s2_density,
            s3_density: this.formData.s3_density,
            g1_density: this.formData.g1_density,
            g2_density: this.formData.g2_density,
            g3_density: this.formData.g3_density,
            ad1_density: this.formData.ad1_density,
            ad2_density: this.formData.ad2_density,
            ad3_density: this.formData.ad3_density
        };
        return element2;
    }

    setElement2(data: Element2) {
        // Update the Address data only when the Address Form had been validated successfully
        this.isElementFormValid = true;
        this.formData.s1_unit = data.s1_unit;
        this.formData.s2_unit = data.s2_unit;
        this.formData.s3_unit = data.s3_unit;
        this.formData.g1_unit = data.g1_unit;
        this.formData.g2_unit = data.g2_unit;
        this.formData.g3_unit = data.g3_unit;
        this.formData.ad1_unit = data.ad1_unit;
        this.formData.ad2_unit = data.ad2_unit;
        this.formData.ad3_unit = data.ad3_unit;
        
        this.formData.s1_density = data.s1_density;
        this.formData.s2_density = data.s2_density;
        this.formData.s3_density = data.s3_density;
        this.formData.g1_density = data.g1_density;
        this.formData.g2_density = data.g2_density;
        this.formData.g3_density = data.g3_density;
        this.formData.ad1_density = data.ad1_density;
        this.formData.ad2_density = data.ad2_density;
        this.formData.ad3_density = data.ad3_density;

        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.element2);
    }

    getPercentage() : Percentage {
        // Return the Address data
        var element: Percentage = {
            air: this.formData.air,
            aggregate: this.formData.aggregate,
            volume: this.formData.volume,
            wet: this.formData.wet 
        };
        return element;
    }

    setPercentage(data: Percentage) {
        // Update the Address data only when the Address Form had been validated successfully
        this.isPercentageFormValid = true;
        this.formData.air = data.air;
        this.formData.aggregate = data.aggregate;
        this.formData.volume = data.volume;
        this.formData.wet = data.wet;
        
        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.percentage);
    }

    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }

    resetFormData(): FormData {
        // Reset the workflow
        this.workflowService.resetSteps();
        // Return the form data after all this.* members had been reset
        this.formData.clear();
        this.isPersonalFormValid = this.isElementFormValid = this.isElement2FormValid = this.isPercentageFormValid = false;
        return this.formData;
    }

    isFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
        return this.isPersonalFormValid &&
                this.isElementFormValid && 
                this.isElement2FormValid &&
                this.isPercentageFormValid;
    }
}