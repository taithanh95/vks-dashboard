import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../common/constant/constant.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private http: Http,
    private router: Router
  ) {
  }

  inProgress: boolean = false;

  modelForgotPassword = {
    username: '',
    email: ''
  };

  ngOnInit(): void {
  }

  public resetPassword() {
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'password/resetPasswordByUser'
      , this.modelForgotPassword).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.toastrService.success( 'Reset mật khẩu thành công, mật khẩu mới là 123456');
          this.router.navigate(['login']);
        } else {
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
        this.inProgress = false;
      });
  }

  nagivateLogin() {
    this.router.navigate(['login']);
  }

}
