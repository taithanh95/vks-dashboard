import {CookieService} from 'ngx-cookie-service';

import {ConstantService} from '../../common/constant/constant.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private cookieService: CookieService,
    private constantService: ConstantService,
    private http: HttpClient,
    private router: Router
  ) {
  }
}


