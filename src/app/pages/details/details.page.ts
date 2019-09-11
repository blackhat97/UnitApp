import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  mixId : string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public actionSheetController: ActionSheetController,

  ) {
    this.mixId = this.activatedRoute.snapshot.paramMap.get('id');

   }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '더보기',
      buttons: [{
        text: '인쇄',
        icon: 'print',
        handler: () => {
        }
      },{
        text: '취소',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

}
