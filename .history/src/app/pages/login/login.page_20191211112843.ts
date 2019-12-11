import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/providers/services/authentication.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segment = 'login';

  credentialsForm: FormGroup;
  adminForm: FormGroup;
  deferredPrompt: any;
  showInstallBtn: boolean = true;
  alerts: Array<any> = [];
  
  passwordShown: boolean = false;
  passwordType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private authService: AuthenticationService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public support: SupportService,
    public storage: Storage
  ) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBtn = true;
    });
    this.alerts.push({
      message: '홈화면 추가',
    });
  }

  togglePassword() {
    if(this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_login').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/tabs/tab1');
      }
    });
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required]]
    });
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required]],
      device: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]],
    });

    if(this.deferredPrompt === undefined){
      this.showInstallBtn = false;
    }
  }

  onLogin() {
    this.authService.login(this.credentialsForm.value).subscribe((res) => {
      this.navCtrl.navigateRoot('/tabs/tab1').then(() => this.storage.set('ion_did_login', 'true'));
    });
  }
  
  onSignup() {
    this.router.navigateByUrl('/signup');
  }
  
  showInstallBanner() {
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // We no longer need the prompt.  Clear it up.
        this.deferredPrompt = null;
      });
    }
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }




}
