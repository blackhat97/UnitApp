import { EditMixComponent } from './../../components/edit-mix/edit-mix.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
    ],
    exports: [EditMixComponent],
    declarations: [EditMixComponent]
})
export class SharedEditMixModule { }
