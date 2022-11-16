import {Component, OnInit} from '@angular/core';
import {INavData} from '@coreui/angular';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Event, NavigationEnd, Router} from '@angular/router';
import {Http} from '@angular/http';
import {ConstantService} from '../../common/constant/constant.service';
import {GroupRole} from '../../category/model/category.model';
import {ToastrService} from 'ngx-toastr';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})

export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems: INavData[];
  public logged: boolean;
  public username: string;
  public name: string;
  public breadcrumbs: IBreadCrumb[];

  public isChangePasswordVisible: boolean;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: Http,
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';

    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    const tooltip = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.title : '';
    if (!label && tooltip) {
      label = tooltip;
    }
    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }
    const nextUrl = path ? `${url}/${path}` : url;
    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
      tooltip: tooltip
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  async ngOnInit() {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    });
    const loginUserId = this.cookieService.get(this.constantService.LOGIN_USER_ID);
    if (!loginUserId || loginUserId === 'undefined') {
      this.router.navigate(['login']);
      this.logged = false;
    } else {
      this.logged = true;
      this.username = this.cookieService.get(this.constantService.USERNAME);
      // tslint:disable-next-line:max-line-length
      this.name = this.cookieService.get(this.constantService.USER_FULL_NAME);
      const groupRoleList = <GroupRole[]>(await this.getMenuByUsername(loginUserId));
      let allRole = '';

      // Menu danh muc
      this.navItems = [];
      // Menu fix cứng sổ thụ lý(nghiệp vụ)
      // const menuSoThuLy = {
      //   appCode: 'Nghiệp vụ Sổ thụ lý',
      //   icon: 'fa fa-file-text-o',
      //   name: 'Nghiệp vụ Sổ thụ lý',
      //   attributes: {title: 'Nghiệp vụ Sổ thụ lý'},
      //   url: environment.QUANLYAN_URI,
      //   children: [
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Tiếp nhận và xử lý tin báo tố giác',
      //       attributes: {title: 'Tiếp nhận và xử lý tin báo tố giác'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyTinBao/search/tin-moi`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Quản lý bắt, tạm giam, tạm giữ',
      //       attributes: {title: 'Quản lý bắt, tạm giam, tạm giữ'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyBatTamGiamTamGiu/search`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Quản lý thông tin vi phạm pháp luật trong HĐTP',
      //       attributes: {title: 'Quản lý thông tin vi phạm pháp luật trong HĐTP'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyViPham/search`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Quản lý yêu cầu bồi thường',
      //       attributes: {title: 'Quản lý yêu cầu bồi thường'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/compensations`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Xem xét lại',
      //       attributes: {title: 'Xem xét lại'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/xemXetLai`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Cấp số lệnh, quyết định vụ án',
      //       attributes: {title: 'Cấp số lệnh, quyết định vụ án'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-vu-an`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Cấp số lệnh, quyết định bị can',
      //       attributes: {title: 'Cấp số lệnh, quyết định bị can'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-bi-can`
      //     },
      //     {
      //       appCode: 'Nghiệp vụ Sổ thụ lý',
      //       class: 'pl-4',
      //       name: 'Cấp số lệnh, quyết định tin báo',
      //       attributes: {title: 'Cấp số lệnh, quyết định tin báo'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-tin-bao`
      //     }
      //   ]
      // };
      // this.navItems.push(menuSoThuLy);
      // Load menu tự động từ backend
      if (groupRoleList && groupRoleList.length > 0) {
        for (const groupRole of groupRoleList) {
          let arrChildren: any[] = [];
          if (groupRole.children) {
            for (const cRole of groupRole.children) {
              cRole.class = 'pl-4';
              allRole += cRole.url + '___';
              arrChildren.push({...cRole, attributes: {title: cRole.description}});
            }
          }
          this.navItems.push(
            {
              ...groupRole, attributes: {title: groupRole.name},
              children: arrChildren
            }
          );
        }
        const gopY = {
          appCode: 'Góp ý',
          icon: 'fa fa-tty',
          name: 'Diễn đàn trao đổi',
          url: '/gop-y'
        };
        this.navItems.push(gopY);
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        this.cookieService.set(this.constantService.USER_ROLE_LIST, allRole, expiredDate, '/', environment.DOMAIN);
      } else {
        this.toastrService.warning('Tài khoản chưa được cấu hình chức năng');
        this.router.navigate(['login']);
      }
    }

    this.getSppByUsername();
    this.getDecisionByUseForAndStatus();
    this.getGroupLawByStatus();
    this.getPol();
  }

  getSppByUsername() {
    this.constantService.postRequest(this.constantService.MANAGE_URI + 'spp/findByUsername/'
      , {
        'username': this.cookieService.get(this.constantService.USERNAME)
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          localStorage.setItem(this.constantService.VIEN_KIEM_SAT, JSON.stringify(resJson.responseData));
        }
      })
      .catch(() => console.log('Exception when DefaultLayoutComponent.getSppByUsername()'));
  }

  getDecisionByUseForAndStatus() {
    this.constantService.postRequest(this.constantService.MANAGE_URI + 'decision/findByStatus/'
      , {
        'status': 'Y'
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          localStorage.setItem(this.constantService.QUYET_DINH, JSON.stringify(resJson.responseData));
        }
      })
      .catch(() => console.log('Exception when DefaultLayoutComponent.getDecisionByUseForAndStatus()'));
  }

  getGroupLawByStatus() {
    this.constantService.postRequest(this.constantService.MANAGE_URI + 'code/getList/'
      , {
        'status': 'Y'
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          localStorage.setItem(this.constantService.BO_LUAT, JSON.stringify(resJson.responseData));
        }
      })
      .catch(() => console.log('Exception when DefaultLayoutComponent.getGroupLawByStatus()'));
  }

  getPol(): void {
    this.constantService.postRequest(this.constantService.MANAGE_URI + 'pol/getList/'
      , {}).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          localStorage.setItem(this.constantService.CO_QUAN, JSON.stringify(resJson.responseData));
        }
      })
      .catch(() => console.log('Exception when DefaultLayoutComponent.getPol()'));
  }

  getMenuByUsername(loginUserId: string) {
    return new Promise((resolve, reject) => {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'role/getMenuByUserId/'
        , {
          'userId': loginUserId,
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            resolve(resJson.responseData);
          } else if (resJson.responseCode === '0007') {
            // Không thấy kết quả thì không làm gì cả
          } else if (resJson.responseCode === '0028') {
            this.toastrService.warning('Phiên làm việc đã hết.');
            this.router.navigate(['login']);
          }
        })
        .catch(err => {
          this.toastrService.warning('Phiên làm việc đã hết.');
          this.router.navigate(['login']);
        });
    });
  }

  logout() {
    this.constantService.postRequest(this.constantService.AUTH_URI + 'auth/logout/'
      , {'accessToken': this.cookieService.get(this.constantService.ACCESS_TOKEN)}).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (this.cookieService.check(this.constantService.LOGIN_USER_ID)) {
            this.cookieService.delete(this.constantService.LOGIN_USER_ID, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.USER_FULL_NAME)) {
            this.cookieService.delete(this.constantService.USER_FULL_NAME, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.USERNAME)) {
            this.cookieService.delete(this.constantService.USERNAME, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.ACCESS_TOKEN)) {
            this.cookieService.delete(this.constantService.ACCESS_TOKEN, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.USER_ROLE_LIST)) {
            this.cookieService.delete(this.constantService.USER_ROLE_LIST, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.ID_SPP)) {
            this.cookieService.delete(this.constantService.ID_SPP, '/', environment.DOMAIN);
          }
          if (this.cookieService.check(this.constantService.USER_TYPE)) {
            this.cookieService.delete(this.constantService.USER_TYPE, '/', environment.DOMAIN);
          }
          localStorage.clear();
          this.toastrService.success('Đăng xuất thành công');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Có lỗi khi thực hiện: ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.error('Có lỗi khi thực hiện: ' + err);
      });
  }

  changePassword(){
    this.isChangePasswordVisible = true;
  }

  closeModal(isClose: boolean): void {
    this.isChangePasswordVisible = isClose;
  }

}

export interface IBreadCrumb {
  label: string;
  url: string;
  tooltip: string;
}
