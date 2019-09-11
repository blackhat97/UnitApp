import { DefaultComponent } from './components/default/default.component';
import { FinalComponent } from './components/final/final.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { RegisterPageRoutingModule } from './register.router.module';
import { ElementComponent } from './components/element/element.component';
import { WorkflowService } from 'src/app/providers/workflow/workflow.service';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { PercentageComponent } from './components/percentage/percentage.component';
import { Element2Component } from './components/element2/element2.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule
  ],
  declarations: [
    RegisterPage,
    DefaultComponent,
    ElementComponent,
    Element2Component,
    PercentageComponent,
    FinalComponent,

  ],
  providers:    [{ provide: FormDataService, useClass: FormDataService },
    { provide: WorkflowService, useClass: WorkflowService }],
})
export class RegisterPageModule {}
