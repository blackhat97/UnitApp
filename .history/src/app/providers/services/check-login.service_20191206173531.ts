import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class CheckLogin implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad() {
    return this.storage.get('ion_did_login').then(res => {
      if (res) {
        this.router.navigate(['/tabs', 'tab1']);
        return false;
      } else {
        return true;
      }
    });
  }
}
