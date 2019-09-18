import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss']
})
export class AggregateComponent implements OnInit {

  budget: string;
  footnote: string;
  
  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {

  }

  onEvent(ev) {
    let name = ev.target.name;
    switch (name) {
      case "aggregate1":
        this.footnote = "용기+골재를 저울에 올리고 적용 버튼을 누르세요.";
        break;
      case "aggregate2":

        break;
      case "iPressure":

        break;
      case "ePressure":

        break;
    }
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
