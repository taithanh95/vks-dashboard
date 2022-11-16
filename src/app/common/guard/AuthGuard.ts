import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {ConstantService} from '../constant/constant.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private cookieService: CookieService,
              private toastrService: ToastrService,
              private constantService: ConstantService
  ) {
  }

  canActivate(
    next: any,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const userRoleList = this.cookieService.get(this.constantService.USER_ROLE_LIST);
    // If the previous URL was blank, then the user is directly accessing this page
    const currentUrl = next._routerState.url;
    if (userRoleList.includes(currentUrl)) {
      return true;
    } else {
      this.toastrService.success( 'Tài khoản không có quyền truy cập chức năng');
      this.router.navigate(['403']); // Navigate away to some other page
      return false;
    }
  }
}
