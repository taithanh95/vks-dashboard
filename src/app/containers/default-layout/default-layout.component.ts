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
      // Menu fix c???ng s??? th??? l??(nghi???p v???)
      // const menuSoThuLy = {
      //   appCode: 'Nghi???p v??? S??? th??? l??',
      //   icon: 'fa fa-file-text-o',
      //   name: 'Nghi???p v??? S??? th??? l??',
      //   attributes: {title: 'Nghi???p v??? S??? th??? l??'},
      //   url: environment.QUANLYAN_URI,
      //   children: [
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'Ti???p nh???n v?? x??? l?? tin b??o t??? gi??c',
      //       attributes: {title: 'Ti???p nh???n v?? x??? l?? tin b??o t??? gi??c'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyTinBao/search/tin-moi`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'Qu???n l?? b???t, t???m giam, t???m gi???',
      //       attributes: {title: 'Qu???n l?? b???t, t???m giam, t???m gi???'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyBatTamGiamTamGiu/search`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'Qu???n l?? th??ng tin vi ph???m ph??p lu???t trong H??TP',
      //       attributes: {title: 'Qu???n l?? th??ng tin vi ph???m ph??p lu???t trong H??TP'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/quanLyViPham/search`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'Qu???n l?? y??u c???u b???i th?????ng',
      //       attributes: {title: 'Qu???n l?? y??u c???u b???i th?????ng'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/compensations`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'Xem x??t l???i',
      //       attributes: {title: 'Xem x??t l???i'},
      //       url: `${environment.QUANLYAN_URI}admin/sothuly/xemXetLai`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'C???p s??? l???nh, quy???t ?????nh v??? ??n',
      //       attributes: {title: 'C???p s??? l???nh, quy???t ?????nh v??? ??n'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-vu-an`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'C???p s??? l???nh, quy???t ?????nh b??? can',
      //       attributes: {title: 'C???p s??? l???nh, quy???t ?????nh b??? can'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-bi-can`
      //     },
      //     {
      //       appCode: 'Nghi???p v??? S??? th??? l??',
      //       class: 'pl-4',
      //       name: 'C???p s??? l???nh, quy???t ?????nh tin b??o',
      //       attributes: {title: 'C???p s??? l???nh, quy???t ?????nh tin b??o'},
      //       url: `${environment.QUANLYAN_URI}admin/so-thu-ly/dang-ky-lenh-tin-bao`
      //     }
      //   ]
      // };
      // this.navItems.push(menuSoThuLy);
      // Load menu t??? ?????ng t??? backend
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
          appCode: 'G??p ??',
          icon: 'fa fa-tty',
          name: 'Di???n ????n trao ?????i',
          url: '/gop-y'
        };
        this.navItems.push(gopY);
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        this.cookieService.set(this.constantService.USER_ROLE_LIST, allRole, expiredDate, '/', environment.DOMAIN);
      } else {
        this.toastrService.warning('T??i kho???n ch??a ???????c c???u h??nh ch???c n??ng');
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
            // Kh??ng th???y k???t qu??? th?? kh??ng l??m g?? c???
          } else if (resJson.responseCode === '0028') {
            this.toastrService.warning('Phi??n l??m vi???c ???? h???t.');
            this.router.navigate(['login']);
          }
        })
        .catch(err => {
          this.toastrService.warning('Phi??n l??m vi???c ???? h???t.');
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
          this.toastrService.success('????ng xu???t th??nh c??ng');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('C?? l???i khi th???c hi???n: ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.error('C?? l???i khi th???c hi???n: ' + err);
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
