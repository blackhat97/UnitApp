import { environment } from './../../../environments/environment.prod';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {

  url = environment.url;
  TOKEN_NAME = environment.jwt_token;

  public headers: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private alertController: AlertController,

  ) { 
    this.storage.get(this.TOKEN_NAME).then(token => {
      if (token) {
        this.headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token);
      }
    });

  }

  updateCommon(id, data) {
    return this.http.put(`${this.url}/common/${id}`, data, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  updateMix(id, data) {
    return this.http.put(`${this.url}/mix/${id}`, data, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }



  insertRegisterMix(id, data) {
    return this.http.post(`${this.url}/mix-register/${id}`, data, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  measureResult(data) {
    return this.http.post(`${this.url}/measure-result`, data, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  deleteCompany(id) {
    return this.http.delete(`${this.url}/company/${id}`, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  deleteContractor(id) {
    return this.http.delete(`${this.url}/contractor/${id}`, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  deleteSite(id) {
    return this.http.delete(`${this.url}/site/${id}`, { headers: this.headers })
    .pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showAlert("오류가 생겼습니다.");
        throw new Error(e);
      })
    )
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: '알림',
      buttons: ['확인']
    });
    alert.then(alert => alert.present());
  }

}
