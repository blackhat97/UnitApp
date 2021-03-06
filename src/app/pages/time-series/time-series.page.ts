import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetApiService } from 'src/app/providers/services/get-api.service';

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
    public router: Router,

  ) { }

  ionViewDidEnter() {
    this.activateroute.params.subscribe((data: any) => {
      const _start = data.start,
            _end = data.end,
            _company = data.company,
            _contractor = data.contractor,
            _site = data.site,
            _mixnum = data.mixnum;

            this.getapi.getTimeseries(_start, _end, _company, _contractor, _site, _mixnum).subscribe((res: any) => {
              this.rows = res;
      });
      
    });
  }

  ngOnInit() {
  }

  onActivate(event) {
    if(event.type == 'click') {
      let row = event.row;
      this.router.navigate( [`/app/details/${row.id}`]);

    }
  }

}
