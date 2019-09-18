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
        this.footnote = "용기+골재+물을 저울에 올리고 적용 버튼을 누르세요.";
        break;
      case "iPressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        break;
      case "ePressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        break;
      default: 
        this.footnote = "메시지 없음";
    }
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
