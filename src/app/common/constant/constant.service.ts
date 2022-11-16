import {Injectable,} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {Headers, Http, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class ConstantService {
  AUTH_URI = environment.GATEWAY_URI + 'api/sso/';
  CATEGORY_URI = environment.GATEWAY_URI + 'api/category/';
  MANAGE_URI = environment.GATEWAY_URI + 'api/manage/';
  SOTHULY_URI = environment.GATEWAY_URI + 'api/sothuly/';
  NOTIFICATION_URI = environment.GATEWAY_URI + 'api/notification/';
  REPORT_URI = environment.GATEWAY_URI + 'api/report/';
  QUAN_LY_AN = environment.GATEWAY_URI + 'api/quanlyan/dm/';
  API_QUANLYAN = environment.GATEWAY_URI + 'api/quanlyan/';
  ACCESS_TOKEN = 'access_token';
  LOGIN_USER_ID = 'login_user_id';
  USER_TYPE = 'user_type';

  USERNAME = 'username';
  USER_FULL_NAME = 'user_first_name';
  ID_SPP = 'id_spp';
  SPP_NAME = 'spp_name';
  QUYET_DINH = 'quyet_dinh';
  CO_QUAN = 'co_quan';
  BO_LUAT = 'bo_luat';
  VIEN_KIEM_SAT = 'vien_kiem_sat';
  size = 10;
  USER_ROLE_LIST = 'user_role_list';
  // REQUEST_REPORT : Danh sách yêu cầu báo cáo ở trạng thái chờ xử lý và đang xử lý
  LIST_REQUEST_REPORT_NEW_AND_PROCESSING: 'LIST_REQUEST_REPORT_NEW_AND_PROCESSING';
  SYSTEM_ERROR = 'Hệ thống không có phản hồi';

  constructor(
    private http: Http,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {
  }

  public createHeaders() {
    // Why "authorization": see CustomLogoutSuccessHandler on server
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get(this.ACCESS_TOKEN));
  }

  getRequestHeader() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get(this.ACCESS_TOKEN));
    return new RequestOptions({headers: headers});
  }
  //
  // getRequestParamHeader(body) {
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json; charset=utf-8');
  //   headers.append('Authorization', 'Bearer ' + this.cookieService.get(this.ACCESS_TOKEN));
  //   return new RequestOptions({headers, body});
  // }

  postRequest(url: string, body: any) {
    return this.http.post(url, body, this.getRequestHeader());
  }

  getRequest(url: string) {
    return this.http.get(url, this.getRequestHeader());
  }

  get(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(this.API_QUANLYAN + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'text',
        });
      case 'blob':
        return this.httpClient.get(this.API_QUANLYAN + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'blob',
        });
      default:
        return this.httpClient.get(this.API_QUANLYAN + url, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  post(url: string, data: any, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.post(this.API_QUANLYAN + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'text',
          params
        });
      default:
        return this.httpClient.post(this.API_QUANLYAN + url, data, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  //
  // getApi(url: string, body?: {}) {
  //   return this.http.post(url,body,this.getRequestHeader());
  // }

  // getApi(url: string, params?: {}) {
  //   return this.http.get(url,
  //     headers: this.createHeaders() || {},
  //     params
  //   );
  // }
}
