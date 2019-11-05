import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from '../providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  DEVICEID = environment.device_id;

  action = false;
  blank=false;
  items: any;
  /*
  items=[
    {image:'../../assets/imgs/wishlist/img10.png',title:'Food Blender BLF01 FZ4001',brand:'Smeg',price:'$230',value:1},
    {image:'../../assets/imgs/wishlist/img11.png',title:'Rice Cooker MB-FZ4001',brand:'Media Global',price:'$290',value:2},
    {image:'../../assets/imgs/wishlist/img8.png',title:'Food Processor MK-F800',brand:'Panasonic',price:'$230',value:3},
    {image:'../../assets/imgs/wishlist/img9.png',title:'Air Purifier AM501 Tr3',brand:'Lg Signature',price:'$430',value:4},
  ]
  */

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    public router: Router,

  ) {}

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.favorites(device).subscribe((res) => {
        this.items = res;
        console.log(res);
      });
    });
  }

  indexDelete(res){
    let index=this.items.findIndex(item => item.value===res);
    this.items[index].value*=-1;
    console.log('ini indes res ',this.items.findIndex(item => item.value===res));
    console.log('ini indes res ',this.items[index].value);
  }

  hapus(){
    console.log('h');
    /*
    this.items=this.items.filter((res)=>{
      return res.value>0
    })
    if(this.items.length===0) this.blank=true;
    console.log(this.items);
    */
  }

  movetab2(id) {
    this.router.navigate( [`/tabs/tab2`, {id: id}]);
  }

}