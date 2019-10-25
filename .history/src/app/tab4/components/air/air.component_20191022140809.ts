import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormulaService } from 'src/app/providers/services/formula.service';

@Component({
  selector: 'app-air',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public formula: FormulaService,
    
  ) { }

  ngOnInit() {
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
