import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { SupportService } from 'src/app/providers/services/support.service';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.page.html',
  styleUrls: ['./time-series.page.scss'],
})
export class TimeSeriesPage implements OnInit {

  rows = [];
  table_messages = {
    'emptyMessage': '데이터가 없습니다.',
    'totalMessage': ''
  };

  constructor(
    public activateroute: ActivatedRoute,
    public getapi: GetApiService,
    private support: SupportService
  ) { }

  ionViewDidEnter() {
    this.activateroute.params.subscribe((data: any) => {
      let _start = data.start,
            _end = data.end,
            _company = data.company,
            _contractor = data.contractor,
            _site = data.site,
            _mixnum = data.mixnum;

        
      if (_start > _end) {
        this.support.showAlert("날짜설정이 잘못되었습니다.");
        return;
      }
  
      _start = _start.split("T", 1)[0];
      _end = _end.split("T", 1)[0];
      
      this.getapi.getTimeseries(_start, _end, _company, _contractor, _site, _mixnum).subscribe((res: any) => {
        console.log(res);
      });
      
    });
  }

  ngOnInit() {
  }

}
