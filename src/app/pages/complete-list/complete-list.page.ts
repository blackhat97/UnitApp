import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { DatepickerI18nKoreanService } from 'src/app/providers/services/datepicker-i18n-korean.service';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-complete-list',
  templateUrl: './complete-list.page.html',
  styleUrls: ['./complete-list.page.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: DatepickerI18nKoreanService}
  ]
})
export class CompleteListPage implements OnInit {

  DEVICEID = environment.device_id;
  queryText = '';
  results: any;

  constructor(
    public getapi: GetApiService,
    private storage: Storage,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.completeList(device).subscribe((res) => {
        this.results = res;

      });
    });
  }

  updateList(ev) {
    let queryText = ev.target.value;
    
    //queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    this.results.forEach((session: any) => {
      this.filterSession(session, queryWords);
    });
  }

  filterSession(session, queryWords) {
    let matchesQueryText = false;

    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (session.mixnum.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }
    session.hide = !matchesQueryText;

  }

}
