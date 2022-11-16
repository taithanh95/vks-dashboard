import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppComponent} from './app.component';
// Import containers
import {DefaultLayoutComponent} from './containers';

import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';
import {ConstantService} from './common/constant/constant.service';
import {CommonService} from './common/service/common.service';
import {NumberService} from './common/util/number.service';
import {CustomAdapter, CustomDateParserFormatter, DateService} from './common/util/date.service';
import {ExcelService} from './common/excel/excel.service';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
// Import routing module
import {AppRoutingModule} from './app.routing';
// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from './shared/components/confirmation-dialog/confirmation-dialog.service';

import {ToastrModule} from 'ngx-toastr';
import {Constant} from './common/constant/constant';

// Import menu module routing
import {CategoryModule} from './category/category.module';
import {UserModule} from './user/user.module';
import {RoleModule} from './role/role.module';
import {CommonComponentsModule} from './shared/components/common-components.module';
import {ForgotPasswordComponent} from './views/forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './views/change-password/change-password.component';
import {AuthGuard} from './common/guard/AuthGuard';
import {P403Component} from './views/error/403.component';
import {SoThuLyModule} from './so-thu-ly/so-thu-ly.module';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {CookieService} from 'ngx-cookie-service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

/** config angular i18n **/
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {vi} from 'date-fns/locale';

registerLocaleData(en);
/** config ng-zorro-antd i18n **/
import {NZ_DATE_LOCALE, NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    RouterModule,
    HttpModule,
    NgxPaginationModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    NgbModule,
    UserModule,
    RoleModule,
    CategoryModule,
    SoThuLyModule,
    CommonComponentsModule,
    NzBreadCrumbModule,
    NzToolTipModule,
    TooltipModule,
    NzIconModule,
    ToastrModule.forRoot({
      timeOut: Constant.TOAST_TIMER_OUT,
      closeButton: true,
      progressBar: true
    }),
    NzModalModule,
    NzTableModule,
    NzGridModule,
    NzButtonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P403Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    ConstantService,
    CommonService,
    NumberService,
    DateService,
    ExcelService,
    ConfirmationDialogService,
    AuthGuard,
    CustomAdapter,
    CustomDateParserFormatter,
    CookieService,
    NgbActiveModal,
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_DATE_LOCALE, useValue: vi}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
