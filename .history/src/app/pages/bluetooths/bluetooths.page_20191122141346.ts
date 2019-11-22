import { hexTable } from 'src/app/providers/printer/cp949-tables';
import { SupportService } from './../../providers/services/support.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { BluetoothService } from 'src/app/providers/providers';
import { AlertController, ToastController } from '@ionic/angular';
import { ESCPOSImage } from 'src/app/providers/printer/escpos-image';
import { ESCPOSPrinter } from 'src/app/providers/printer/escpos-printer';

@Component({
  selector: 'app-bluetooths',
  templateUrl: './bluetooths.page.html',
  styleUrls: ['./bluetooths.page.scss'],
})
export class BluetoothsPage {

  DEVICEID = environment.device_id;
  uuids: any;
  isConnected = false;
  realtime: string = '0';
  pressure: number[] = [0, 0];
  private interval = null;

  message = '';
  messages = [];

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    private translate: TranslateService,
    private bluetooth: BluetoothService,
    private alertCtrl: AlertController,
    private support: SupportService
  ) { }

  ngAfterViewInit() {
    
    this.interval = setInterval(() => {      
      this.requestData();
    }, 1*1000);
    
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.uuids = res;
      });
    });

  }

  checkConnection(seleccion) {
    this.bluetooth.checkConnection().then(async (isConnected) => {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('BLUETOOTH.ALERTS.RECONNECT.TITLE'),
        message: this.translate.instant('BLUETOOTH.ALERTS.RECONNECT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('취소'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.translate.instant('수락'),
            handler: () => {
              this.disconnect().then(() => {
                this.bluetooth.deviceConnection(seleccion).then(success => {                  
                  this.isConnected = true;

                  this.support.presentToast(this.translate.instant(success));
                }, fail => {
                  this.isConnected = false;
                  this.support.presentToast(this.translate.instant(fail));
                });

              });
            }
          }
        ]
      });
      await alert.present();
    }, async (notConnected) => {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('BLUETOOTH.ALERTS.CONNECT.TITLE'),
        message: this.translate.instant('BLUETOOTH.ALERTS.CONNECT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('취소'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.translate.instant('수락'),
            handler: () => {
              this.bluetooth.deviceConnection(seleccion).then(success => {
                
                this.isConnected = true;

                this.support.presentToast(this.translate.instant(success));
              }, fail => {
                this.isConnected = false;
                this.support.presentToast(this.translate.instant(fail));
              });
            }
          }
        ]
      });
      await alert.present();
    });
  }

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }


  requestData() {
    let data = new Uint8Array(3);
    data[0] = 0x02;
    data[1] = 0x20;
    data[2] = 0x03;
    this.bluetooth.dataInOutRealtime(data).then((res) => {
      if(res.length == 22) {
        this.pressure[0] = res.substring(6, 11);
        this.pressure[1] = res.substring(16, 21);
      } else {
        this.realtime = res.replace(/[^0-9]/g,'');
      }
      
    });
  }

  imagePrint() {
    // Create image
    let image = new Image();
    let printData: any;
    // Set data
    image.src = 'assets/img/404_image.png';

    // Create ESCPOS image
    let escposImage = new ESCPOSImage(image);

    // Initialize ESCPOS printer
    let escposPrinter = new ESCPOSPrinter(new Buffer([]));

    // Print image
    escposPrinter.raster(escposImage);

    // Assign data to print queue
    printData = Buffer.concat([escposPrinter.getBuffer(), printData]);
    console.log(printData);
  }

  sendMessage(message) {
    this.bluetooth.dataInOut(`${message}\n`).subscribe(data => {
      if (data !== 'BLUETOOTH.NOT_CONNECTED') {
        try {
          if (data) {
            const entry = JSON.parse(data);
            this.addLine(message);
          }
        } catch (error) {
          console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
        }
        // this.presentToast(data);
        this.message = '';
        console.log(data);
      } else {
        this.support.presentToast(this.translate.instant(data));
      }
    });
  }

  addLine(message) {
    this.messages.push(message);
  }

  ionViewWillLeave(){
    clearInterval(this.interval);
  }

  ngOnDestroy() {
    this.disconnect();
  }

}
