import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMeasureModule } from '../providers/shared/shared-measure.module';
import { EditMixComponent, MeasureComponent, ResultComponent } from '../tab2/components';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMeasureModule,
    TranslateModule.forChild(),
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [
    Tab1Page,
  ],
  entryComponents: [
    EditMixComponent,
    MeasureComponent,
    ResultComponent
  ]
})
export class Tab1PageModule {}
