import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { TranslateModule } from '@ngx-translate/core';
import { Tab2PageRoutingModule } from './tab2.router.module';
import { EditMixComponent, MeasureComponent, MixListComponent, ResultComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    Tab2PageRoutingModule
  ],
  declarations: [
    Tab2Page,
    EditMixComponent,
    MeasureComponent,
    MixListComponent,
    ResultComponent
  ]
})
export class Tab2PageModule {}
