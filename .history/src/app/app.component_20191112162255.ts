import { SupportService } from './providers/services/support.service';
import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, IonRouterOutlet, ToastController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './providers/services/authentication.service';
import { Router } from '@angular/router';
import { NetworkService, ConnectionStatus } from './providers/services/network.service';
import { AppVersion } from '@ionic-native/app-version/ngx';


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
    public support: SupportService
  ) {
    this.initializeApp();
    this.backButtonEvent();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.checkToken();

      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        this.support.showAlert('네트워크 연결 확인 바랍니다.');
        setInterval(() => {
          navigator['app'].exitApp();
        }, 3000);
      }

    });
  }

  checkToken() {
    this.authService.checkToken();
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
        if (this.router.url === '/tabs/tab1' || this.router.url === '/tabs/tab3' || this.router.url === '/tabs/tab4' || this.router.url === '/tabs/tab5' || this.router.url === '/login' ) {

          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp();

          } else {

            let toast = this.toastCtrl.create({
              message: '뒤로 버튼을 한번 더 누르시면 앱이 종료됩니다.',
              duration: 2000,
              position: 'bottom'
            });
            toast.then(toast => toast.present());
            
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }

}
