import { ModalController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/File/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { PostApiService } from 'src/app/providers/services/post-api.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private platform: Platform, 
    private file: File, 
    private ft: FileTransfer, 
    private fileOpener: FileOpener, 
    private document: DocumentViewer,
    public postapi: PostApiService,

  ) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss();
  }

  openLocalPdf() {
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument('assets/tools.pdf', 'application/pdf', options)
    /*
    let filePath = this.file.applicationDirectory + 'www/assets';
 
    if (this.platform.is('android')) {
      let fakeName = Date.now();
      console.log(filePath);
      this.file.copyFile(filePath, 'tools.pdf', this.file.dataDirectory, `${fakeName}.pdf`).then(result => {
        this.fileOpener.open(result.nativeURL, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      })
    } else {
      // Use Document viewer for iOS for a better UI
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(`${filePath}/tools.pdf`, 'application/pdf', options);
    }
    */

  }

  save(id) {
    let data = {mixid: '1'};
    this.postapi.measureResult(data).subscribe((res) => {
      console.log(res);
    });
  }

}
