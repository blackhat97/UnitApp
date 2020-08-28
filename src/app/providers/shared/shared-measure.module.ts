import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EditMixComponent, MeasureComponent, ResultComponent } from 'src/app/tab2/components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
    ],
    exports: [
        EditMixComponent,
        MeasureComponent,
        ResultComponent
    ],
    declarations: [
        EditMixComponent,
        MeasureComponent,
        ResultComponent
    ]
})
export class SharedMeasureModule { }
