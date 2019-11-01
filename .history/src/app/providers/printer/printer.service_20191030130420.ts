import { Injectable } from '@angular/core';
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor() { }


  generateQrReceipt() {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result.raw([0x1b, 0x74, 0x00]);
    result.size('normal');
    result.raw([0x1d, 0x21, 0x00]);

    result
      .newline()
      .line('***************************************')
      .line('Scan the QR Code to Begin your Ordering')
      .line('***************************************');

    result
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    return result.encode();
  }
  
}
