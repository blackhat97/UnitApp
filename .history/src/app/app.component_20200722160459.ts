import { SupportService } from './providers/services/support.service';
import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, IonRouterOutlet, ToastController, ModalController, NavController, Config, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './providers/services/authentication.service';
import { Router } from '@angular/router';
import { NetworkService, ConnectionStatus } from './providers/services/network.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './providers/providers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private networkService: NetworkService,
    public support: SupportService,
    private androidPermissions: AndroidPermissions,
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    private translate: TranslateService,
    private storage: StorageService,
    private config: Config,
    public alertCtrl: AlertController,

  ) {
    this.initTranslate();
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {

    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      this.splashScreen.hide();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.checkToken();

      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        this.support.showAlert('네트워크 연결 확인 바랍니다.');
        setInterval(() => {
          navigator['app'].exitApp();
        }, 3000);
      }
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.BLUETOOTH, this.androidPermissions.PERMISSION.UPDATE_DEVICE_STATS]);

    });
  }

  checkToken() {
    this.authService.checkToken();
    this.authService.authenticationState.subscribe(state => {
      if (state) {
        this.navCtrl.navigateRoot('/app/tabs/tab1');
      } else {
        this.navCtrl.navigateRoot('/login');
        //this.router.navigate(['login']);
      }
    });

  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

      try {
        const element = await this.modalCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
        throw new Error(error);
      }

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        }
        if (this.router.url === '/app/tabs/tab1' || this.router.url === '/app/tabs/tab3' || this.router.url === '/app/tabs/tab4' || this.router.url === '/app/tabs/tab5' || this.router.url === '/login' ) {

          let alert = this.alertCtrl.create({
            header: '종료창',
            message: '앱을 종료하시겠습니까?',
            buttons: [
              {
                text: this.translate.instant("CANCEL"),
                role: 'cancel'
              },
              {
                text: this.translate.instant("EXIT"),
                handler: () => {
                  navigator['app'].exitApp();
                }
              }
            ]
          });
          alert.then(alert => alert.present());  

          /*
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp();
          } else {

            let toast = this.toastCtrl.create({
              message: this.translate.instant("BACK_CLOSE"),
              duration: 2000,
              position: 'bottom'
            });
            toast.then(toast => toast.present());
            
            this.lastTimeBackPress = new Date().getTime();
          }
          */

        }
      });
    });
  }

  initTranslate() {
    //this.translate.setDefaultLang('ko');
    //this.translate.use('en');

    this.storage.getLang().then(lang => {
      if (!lang && this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang());
      } else {
        this.translate.use(lang || 'en');
      }
      this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
        this.config.set('backButtonText', values.BACK_BUTTON_TEXT);
      });
    });
    
  }

}
