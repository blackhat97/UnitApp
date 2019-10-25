import { Injectable } from '@angular/core';
import { GetApiService } from './get-api.service';
import { Storage } from '@ionic/storage';
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

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    
  ) { }

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
 calculationValue(a,b) {
  return a+b;
 }

 measuredValue() {

 }


  /** 
   * 측정
  */



}
