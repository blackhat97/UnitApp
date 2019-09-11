import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/providers/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private authService: AuthenticationService,
    private alertController: AlertController,
    ) {

    }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passchk: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      device: ['', Validators.required],
    });
    
  }

  onSubmit() {
    this.submitted = true;
    if(this.registerForm.invalid) {
      return;
    }

    const pass = this.registerForm.controls['password'].value;
    const passchk = this.registerForm.controls['passchk'].value;

    if(pass != passchk) {
      this.showAlert('비밀번호가 일치하지 않습니다.\n다시 확인 바랍니다.');
      return false;
    }
    
    this.loading = true;
    this.authService.signup(this.registerForm.value).subscribe();
  }

  closeSignup() {
    this.router.navigateByUrl('/login');
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: '알림',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

}
