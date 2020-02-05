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

    let value = ((o34)/(o33 - (o33*o35/100))).toFixed(4);
    return value;
 }

  /** 
   * 공기량 측정
   * (((O17 - O18) * O19) / O18) / L18 * 100 - O20 - O22
   * 공기량 실측값 = (((초기압력 - 평형압력) * 공기실용적) / 평형압력) / 콘크리트 용적 * 100 - Pz - 골재수정계수
  */
 air(concrete, water, iPressure, ePressure, coefficient) {
  const l16 = this.commons.water - this.commons.mass; //용기용적
  const l18 = l16 - (water - concrete); // 콘크리트 용적
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
  */
  volumeMass(inputs) { //단위용적질량
    /** 
     * 단위용적질량 = 콘크리트 질량 / 콘크리트 용적 * 1000
     * 콘크리트 질량 = 주수전 - 용기질량
     * 콘크리트 용적 = 용기용적 - (주수후 - 주수전) / 물의밀도
    */
    const l16 = this.commons.water - this.commons.mass;
    const l22 = inputs.temp;
    const l23 = 0.99997495*(1-Math.pow((l22-3.983035),2)*(l22+301.797)/(522528.9*(l22+69.34881)));
    let l17 = inputs.concrete - this.commons.mass; //콘크리트 질량
    let l18 = l16-(inputs.water-inputs.concrete)/l23; //콘크리트 용적
    let value = (l17 / l18 * 1000).toFixed(1);
    console.log(value);
    return value;
  }

  airVolume(mixs, inputs) { //공기량 air
  /** 
   * 공기량 측정
   * (((O17 - O18) * O19) / O18) / L18 * 100 - O20 - O22
   * 공기량 실측값 = (((초기압력 - 평형압력) * 공기실용적) / 평형압력) / 콘크리트 용적 * 100 - Pz - 골재수정계수
  */
  const l16 = this.commons.water - this.commons.mass; //용기용적
  const l18 = l16 - (inputs.water - inputs.concrete); // 콘크리트 용적
  let value = ((((inputs.iPressure - inputs.ePressure) * this.commons.air_volume) / inputs.ePressure) / l18 * 100 - this.commons.pz - mixs.aggregate).toFixed(2);
  return value;
  }

  unitQuantity(mixs, inputs) { //단위수량
  /** 
   * 단위수량 = (물의 계량오차 + W질량) / 콘크리트 실용적
   * (l29 + c9) / l28
   * 콘크리트 실용적 = 흡수고려한 단위용적잘량 설정값 * (Vo 밀도 / 1000 - 시멘트의 흡수에 의한 용적변화) / 실제 단위용적 질량
   * l28 = l27 * (j10 / 1000 − l26) / l20
   * 물의 계량오차 =  (콘크리트 실용적 * (1 - 공기량 실측값 / 100) - Vo밀도 / 1000 * (1 - A0질량 / 100) / 시멘트의 흡수에 의한 용적변화) / (1 / (W밀도 * 1000) - 1 / (S밀도 * 1000))
   * l29 = (l28*(1−l19/100)-j10/1000*(1-b9/100)+l26)/(1/(c10*1000)−1/(f10*1000))
  */
    const d3 = mixs.w1_density || 1,
          d4 = mixs.w2_density || 1,
          d5 = mixs.w3_density || 1,
          g3 = mixs.c1_density || 1,
          g4 = mixs.c2_density || 1,
          g5 = mixs.c3_density || 1,
          j3 = mixs.mad1_density || 1,
          j4 = mixs.mad2_density || 1,
          j5 = mixs.mad3_density || 1,
          m3 = mixs.s1_density || 1,
          m4 = mixs.s2_density || 1,
          m5 = mixs.s3_density || 1,
          p3 = mixs.g1_density || 1,
          p4 = mixs.g2_density || 1,
          p5 = mixs.g3_density || 1,
          s3 = mixs.ad1_density || 1,
          s4 = mixs.ad2_density || 1,
          s5 = mixs.ad3_density || 1;


    const b9 = mixs.air,
      c9 = mixs.w1_unit + mixs.w2_unit + mixs.w3_unit,
      d9 = mixs.c1_unit + mixs.c2_unit + mixs.c3_unit,
      e9 = mixs.mad1_unit + mixs.mad2_unit + mixs.mad3_unit,
      f9 = mixs.s1_unit + mixs.s2_unit + mixs.s3_unit,
      g9 = mixs.g1_unit + mixs.g2_unit + mixs.g3_unit,
      h9 = mixs.ad1_unit + mixs.ad2_unit + mixs.ad3_unit,
      c10 = c9 / (mixs.w1_unit/d3 + mixs.w2_unit/d4 + mixs.w3_unit/d5),
      d10 = d9 / (mixs.c1_unit/g3 + mixs.c2_unit/g4 + mixs.c3_unit/g5),
      e10 = e9 / (mixs.mad1_unit/j3 + mixs.mad2_unit/j4 + mixs.mad3_unit/j5),
      f10 = f9 / (mixs.s1_unit/m3 + mixs.s2_unit/m4 + mixs.s3_unit/m5),
      g10 = g9 / (mixs.g1_unit/p3 + mixs.g2_unit/p4 + mixs.g3_unit/p5),
      h10 = h9 / (mixs.ad1_unit/s3 + mixs.ad2_unit/s4 + mixs.ad3_unit/s5);
        
    //console.log(`b9: ${b9}\nc9: ${c9}\nd9: ${d9}\ne9: ${e9}\nf9: ${f9}\ng9: ${g9}\nh9: ${h9}\n`);
    //console.log(`c10: ${c10}\nd10: ${d10}\ne10: ${e10}\nf10: ${f10}\ng10: ${g10}\nh10: ${h10}\n`);

    const j10 = c9/c10+d9/d10+e9/e10+f9/f10+g9/g10+h9/h10+b9*10, //Vo밀도
          k9 = c9+d9+e9+f9+g9+h9,
          l25 = c10*1000*(1/(d10*1000)-1/((d10+0.06)*1000))*100, //시멘트 흡수율
          l26 = d9*(l25/100)/(c10*1000), //시멘트의 흡수에 의한 용적변화
          l27 = k9 / (j10/1000-l26), //흡수고려한 단위용적잘량 설정값
          l19 = this.airVolume(mixs, inputs),
          l20 = this.volumeMass(inputs); // 단위용적 질량
          //l20 = 0;
    const l28 = l27*(j10/1000-l26)/Number(l20), //콘크리트 실용적
        l29 = (l28*(1-Number(l19)/100)-j10/1000*(1-b9/100)+l26)/(1/(c10*1000)-1/(f10*1000)); //물의 계량오차
    let value = ((l29+c9)/l28).toFixed(1);

    //console.log(`j10: ${j10}\nk9: ${k9}\nl25: ${l25}\nl26: ${l26}\nj10: ${j10}\nl27: ${l27}\nl19: ${l19}\nl20: ${l20}\nl28: ${l28}\nl29: ${l29}\n`);

    return value;
 }

 theoryVolume(formData: any, b9: number) {    // 이론용적
  const c3 = formData.w1_unit || 0,
  c4 = formData.w2_unit || 0,
  c5 = formData.w3_unit || 0,
  d3 = formData.w1_density || 1,
  d4 = formData.w2_density || 1,
  d5 = formData.w3_density || 1,
  f3 = formData.c1_unit || 0,
  f4 = formData.c2_unit || 0,
  f5 = formData.c3_unit || 0,
  g3 = formData.c1_density || 1,
  g4 = formData.c2_density || 1,
  g5 = formData.c3_density || 1,
  i3 = formData.mad1_unit || 0,
  i4 = formData.mad2_unit || 0,
  i5 = formData.mad3_unit || 0,
  j3 = formData.mad1_density || 1,
  j4 = formData.mad2_density || 1,
  j5 = formData.mad3_density || 1,
  l3 = formData.s1_unit || 0,
  l4 = formData.s2_unit || 0,
  l5 = formData.s3_unit || 0,
  m3 = formData.s1_density || 1,
  m4 = formData.s2_density || 1,
  m5 = formData.s3_density || 1,
  o3 = formData.g1_unit || 0,
  o4 = formData.g2_unit || 0,
  o5 = formData.g3_unit || 0,
  p3 = formData.g1_density || 1,
  p4 = formData.g2_density || 1,
  p5 = formData.g3_density || 1,
  r3 = formData.ad1_unit || 0,
  r4 = formData.ad2_unit || 0,
  r5 = formData.ad3_unit || 0,
  s3 = formData.ad1_density || 1,
  s4 = formData.ad2_density || 1,
  s5 = formData.ad3_density || 1;

  //const b9 = formData.air,
  const c9 = c3+c4+c5,
  d9 = f3+f4+f5,
  e9 = i3+i4+i5,
  f9 = l3+l4+l5,
  g9 = o3+o4+o5,
  h9 = r3+r4+r5,
  c10 = c9/(c3/d3+c4/d4+c5/d5),
  d10 = d9/(f3/g3+f4/g4+f5/g5),
  e10 = e9/(i3/j3+i4/j4+i5/j5),
  f10 = f9/(l3/m3+l4/m4+l5/m5), 
  g10 = g9/(o3/p3+o4/p4+o5/p5),
  h10 = h9/(r3/s3+r4/s4+r5/s5);
  //console.log(c9, d9, e9, f9, g9, h9, c10, d10, e10, f10, g10, h10);

  let j10 = c9/c10+d9/d10+e9/e10+f9/f10+g9/g10+h9/h10+b9*10; //Vo밀도
  let value = j10.toFixed(3);
  value = value.toString();
  return value;

 }

 cementWet(formData) {
  const f3 = formData.c1_unit || 0,
  f4 = formData.c2_unit || 0,
  f5 = formData.c3_unit || 0,
  f6 = f3+f4+f5,
  g3 = formData.c1_density || 1,
  g4 = formData.c2_density || 1,
  g5 = formData.c3_density || 1,
  g6 = f6/(f3/g3+f4/g4+f5/g5);
  let value = (g6+0.06).toFixed(3);
  value = value.toString();
  return value;
 }



}
