import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetApiService {

  url = environment.url;
  TOKEN_NAME = environment.jwt_token;

  public headers: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,

  ) { 
    this.storage.get(this.TOKEN_NAME).then(token => {
      if (token) {
        this.headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token);
      }
    });
  }

  getProfile(id) {
    const params = new HttpParams().set('userid', id);
    return this.http.get(`${this.url}/profile`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getCompany(id) {
    console.log(this.headers);
    return this.http.get(`${this.url}/select/company/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getContractor(id) {
    return this.http.get(`${this.url}/select/contractor/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getSite(id) {
    return this.http.get(`${this.url}/select/site/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getCommon(id) {
    const params = new HttpParams().set('deviceid', id);
    return this.http.get(`${this.url}/common`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  favorites(id) {
    const params = new HttpParams().set('deviceid', id);
    return this.http.get(`${this.url}/favorite`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  mixList(id, page) {
    const params = new HttpParams()
    .set('deviceid', id)
    .set('page', page);

    return this.http.get(`${this.url}/mix-list`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  completeList(id, page) {
    const params = new HttpParams()
    .set('deviceid', id)
    .set('page', page);
    return this.http.get(`${this.url}/complete-list`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  mixElement(id) {
    return this.http.get(`${this.url}/mix-element/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  measureResult(id) {
    return this.http.get(`${this.url}/result/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  mixDetails(id) {
    return this.http.get(`${this.url}/mix-detail/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  bluetoothUUID(id) {
    return this.http.get(`${this.url}/bluetooth/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getTimeseries(start, end, company, contractor, site, mixnum) {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('company', company)
      .set('contractor', contractor)
      .set('site', site)
      .set('mixnum', mixnum);

    return this.http.get(`${this.url}/timeseries`, { headers: this.headers, params: params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }


}
