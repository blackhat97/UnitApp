import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { LanguageModel } from './models/language.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  languages : Array<LanguageModel> = new Array<LanguageModel>();

  constructor(
    private translate: TranslateService
  ) {
    this.languages.push(
      {name: "English", code: "en"},
      {name: "Korean", code: "ko"}
    );
   }

  getLanguages() {
    return this.languages;
  }

  getDefaultLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang) {
    this.translate.use(setLang);
  }

}
