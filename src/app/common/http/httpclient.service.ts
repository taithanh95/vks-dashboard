import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Constant} from '../constant/constant';
import {CookieService} from 'ngx-cookie-service';
import {ResponseBody} from '../model/base.model';

@Injectable()
export class HttpclientService {
  constructor(private httpClient: HttpClient,
              private cookieService: CookieService) {
  }

  postRequest(module: string, api: string, body: any) {
    return this.httpClient.post<ResponseBody>(environment.GATEWAY_URI + module + api, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this.cookieService.get(Constant.ACCESS_TOKEN),
      })
    });
  }
}
