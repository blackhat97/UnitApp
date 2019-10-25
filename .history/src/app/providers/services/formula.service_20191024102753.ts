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
 aggregateDensity(aggregate, water, iPressure, ePressure) {

    // (골재질량) / (골재용적 - (골재용적 * air / 100))
    const l16 = this.commons.water - this.commons.mass;
    const o33 =  l16 - (water - aggregate);//골재용적
    const o34 =  aggregate - this.commons.mass;//골재잘량
    const o35 = (iPressure - ePressure) * this.commons.air_volume / (ePressure * o33) * 100 - this.commons.pz; //air

    let value = ((o34)/(o33 - (o33*o35/100))).toFixed(2);
    return value;
 }

  /** 
   * 공기량 측정
   * (((O17 - O18) * O19) / O18) / L18 * 100 - O20 - O22
   * 공기량 실측값 = (((초기압력 - 평형압력) * 공기실용적) / 평형압력) / 콘크리트 용적 * 100 - Pz - 골재수정계수
  */
 air(concrete, water, iPressure, ePressure, coefficient) {
  const temp = 21;
  const l16 = this.commons.water - this.commons.mass; //용기용적
  const l23 = 0.99997495*(1-((temp-3.983035)^2)*(temp+301.797)/(522528.9*(temp+69.34881))); // 물의 밀도
  const l18 = l16 - (water - concrete) / l23; // 콘크리트 용적
  let value = ((((iPressure - ePressure) * this.commons.air_volume) / ePressure) / l18 * 100 - this.commons.pz - coefficient).toFixed(2);
  return value;
 }


  /** 
   * 공기량 체크
  */
 calculationValue(water) {
   // (용기용적 - (<공기량체크>[용기+물]-용기질량)) / 용기용적 * 100
   const l16 = this.commons.water - this.commons.mass;
   let value = ((l16-(water - this.commons.mass)) / l16 * 100).toFixed(2);
  return value;
 }

 measuredValue(iPressure, ePressure) {
  // (((초기압력 - 평형압력) * 공기실용적)/평형압력)/용기용적 * 100 - Pz
  let value = ((((iPressure - ePressure) * this.commons.air_volume) / ePressure) / (this.commons.water - this.commons.mass) * 100 - this.commons.pz).toFixed(2);
  return value;
 }


  /** 
   * 측정
   * 단위수량 = (물의 계량오차 + W질량) / 콘크리트 실용적
   * 콘크리트 실용적 = 흡수고려한 단위용적잘량 설정값 * (Vo 밀도 / 1000 - 시멘트의 흡수에 의한 용적변화) / 실제 단위용적 질량
   * 물의 계량오차 =  (콘크리트 실용적 * (1 - 공기량 실측값 / 100) - Vo밀도 / 1000 * (1 - A0질량 / 100) / 시멘트의 흡수에 의한 용적변화) / (1 / (W밀도 * 1000) - 1 / (S밀도 * 1000))
  */
 unitQuantity() { //단위수량



 } 



}
