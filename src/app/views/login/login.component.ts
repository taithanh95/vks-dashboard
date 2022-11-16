import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';
import {AlertsComponent} from '../notifications/alerts.component';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../common/constant/constant.service';
import {Code, Decision, Law, Pol, Spp} from '../../category/model/category.model';
import {environment} from '../../../environments/environment';
import {ResponseCode} from '../../common/constant/response-code';
import {Constant} from '../../common/constant/constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [AlertsComponent]
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private cookieService: CookieService,
    private constantService: ConstantService,
    private alertsComponent: AlertsComponent,
    private toastrService: ToastrService,
    private http: Http,
    private router: Router
  ) {
  }

  inProgress: boolean = false;
  fieldTextType: boolean = true;
  modelLogin = {
    username: '',
    password: ''
  };
  listQuyetDinh: Decision[];
  listPol: Pol[];
  listBoLuat: Code[];
  listVienKiemSat: Spp[];
  listDieuLuat: Law[];

  ngOnInit() {
    const token = this.cookieService.get(this.constantService.ACCESS_TOKEN);
    if (token) {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'token/check/'
        , {
          'accessToken': token
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === ResponseCode.SUCCESS) {
              this.router.navigate(['dashboard']);
            } else if (resJson.responseCode === ResponseCode.TOKEN_NOT_FOUND) {
              this.toastrService.warning('Vui lòng đăng nhập để tiếp tục phiên làm việc');
              this.cookieService.deleteAll();
            } else {
              this.toastrService.warning('Có vấn đề khi thực hiện kiểm tra phiên làm việc. Vui lòng đăng nhập để làm mới phiên làm việc');
              this.cookieService.deleteAll();
            }
          }
        )
        .catch(() => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
        });
    }
  }

  ngOnDestroy() {
  }


  getToken(body: any, options: any) {
    return this.http.post(this.constantService.AUTH_URI + 'auth/login/', body, options);
  }

  signup() {
    this.toastrService.warning('Vui lòng liên hệ với quản trị để được cấp tài khoản');
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  login() {
    if (this.modelLogin.username === '') {
      this.toastrService.warning('Tên người dùng không được để trống!');
      return;
    }
    if (this.modelLogin.password === '') {
      this.toastrService.warning('Mật khẩu không được để trống!');
      return;
    }
    this.inProgress = true;
    this.getToken(
      {
        'username': this.modelLogin.username,
        'password': btoa(this.modelLogin.password)
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
          let inforLogin = resJson.responseData;
          localStorage.setItem(Constant.sppid_label, inforLogin.user.spp.sppId);
          localStorage.setItem(Constant.username_label, inforLogin.user.username);
          localStorage.setItem(Constant.sppname_label, inforLogin.user.spp.name);

          const expiredDate = new Date();
          expiredDate.setDate(expiredDate.getDate() + 7);
          this.cookieService.set(this.constantService.ACCESS_TOKEN, inforLogin.accessToken,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.USERNAME, inforLogin.username,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.USER_FULL_NAME, inforLogin.user.name,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.LOGIN_USER_ID, inforLogin.user.id,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.USER_TYPE, inforLogin.user.type,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.ID_SPP, inforLogin.user.spp.sppId,
            expiredDate, '/', environment.DOMAIN);
          this.cookieService.set(this.constantService.SPP_NAME, inforLogin.user.spp.name,
            expiredDate, '/', environment.DOMAIN);
          this.router.navigate(['dashboard']);
        } else {
          this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(err => {
        this.toastrService.error('Có lỗi khi thực hiện đăng nhập: ' + err);
        this.inProgress = false;
      });
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
