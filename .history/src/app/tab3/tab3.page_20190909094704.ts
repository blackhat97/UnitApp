import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  edit= false;
  items=[
    {image:'../../assets/imgs/wishlist/img10.png',title:'Food Blender BLF01 FZ4001',brand:'Smeg',price:'$230',value:1},
    {image:'../../assets/imgs/wishlist/img11.png',title:'Rice Cooker MB-FZ4001',brand:'Media Global',price:'$290',value:2},
    {image:'../../assets/imgs/wishlist/img8.png',title:'Food Processor MK-F800',brand:'Panasonic',price:'$230',value:3},
    {image:'../../assets/imgs/wishlist/img9.png',title:'Air Purifier AM501 Tr3',brand:'Lg Signature',price:'$430',value:4},
  ]
  
  constructor() {}

  indexDelete(res){
    let index=this.items.findIndex(item => item.value===res);
    this.items[index].value*=-1;
    console.log('ini indes res ',this.items.findIndex(item => item.value===res));
    console.log('ini indes res ',this.items[index].value);
  }
  hapus(){
    this.items=this.items.filter((res)=>{
      return res.value>0
    })
    if(this.items.length===0) this.blank=true;
    console.log(this.items);
  }

}
