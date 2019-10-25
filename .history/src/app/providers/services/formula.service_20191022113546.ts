import { Injectable } from '@angular/core';
import { GetApiService } from './get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
/**
 *
 *
 * @export
 * @class FormulaService
 */
@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  DEVICEID = environment.device_id;

  commons = {
    mass: 0,
    water: 0,
    volume: 0,
    air_volume: 0,
    pz: 0
  };

  constructor(
    public getapi: GetApiService,
    private storage: Storage,

  ) {

    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCommon(device).subscribe((res) => {
        this.commons.mass = res[0].mass;
        this.commons.water = res[0].water;
        this.commons.volume = res[0].volume;
        this.commons.air_volume = res[0].air_volume;
        this.commons.pz = res[0].pz;
      });
    });

   }

  /** 
   * 골재밀도
  */
 aggregateDensity() {

 }

  /** 
   * 공기량 측정
  */
 air() {

 }


  /** 
   * 공기량 체크
  */
 calculationValue(water) {
   // (용기용적 - (<공기량체크>[용기+물]-용기질량)) / 용기용적 * 100
   const l16 = this.commons.water - this.commons.mass;
   let value = (l16-(water - this.commons.mass)) / l16 * 100;
  return value;
 }

 measuredValue() {

 }


  /** 
   * 측정
  */



}
