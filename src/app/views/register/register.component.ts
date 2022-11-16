import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../common/constant/constant.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  constructor(
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private http: Http,
    private router: Router
  ) {
  }

  modelRegister = {
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    passwordRepeat: ''
  };

  clickLogin() {
    this.router.navigate(['login']);
  }

  clickFacebook() {
    this.toastrService.success( 'Chức năng đăng nhập bằng Facebook đang được phát triển');
  }

  clickTwitter() {
    this.toastrService.success( 'Chức năng đăng nhập bằng Twitter đang được phát triển');
  }

  register() {
    this.signup(
      {
        'firstName': this.modelRegister.firstName,
        'lastName': this.modelRegister.lastName,
        'address': this.modelRegister.address,
        'email': this.modelRegister.email,
        'phone': this.modelRegister.phone,
        'username': this.modelRegister.username,
        'password': btoa(this.modelRegister.password) // encode base64
      },
      {
        'headers': {
          'content-type': ['application/json; charset=utf-8']
        }
      }
    ).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.toastrService.success( 'Đăng ký thành công');
          this.router.navigate(['login']);
        } else {
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện đăng ký: ' + err);
      });
  }

  signup(body: any, options: any) {
    return this.http.post(this.constantService.AUTH_URI + 'auth/signup/', body, options);
  }
}
