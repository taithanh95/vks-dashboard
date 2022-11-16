import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-adm-grant-group-to-user',
  templateUrl: './adm-grant-group-to-user.component.html',
  styleUrls: ['./adm-grant-group-to-user.component.css']
})
export class AdmGrantGroupToUserComponent implements OnInit {
  dataState: any;
  arrCollapse: boolean[] = [true, true];

  sppid = this.cookieService.get(this.constantService.ID_SPP);

  dataGroups: any[] = [];
  isLoading: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.dataState = this.router.getCurrentNavigation()?.extras?.state;
    if (!this.dataState) {
      this.goToBack();
    }
    this.getFuncTree(this.dataState.userid, this.sppid);
  }

  ngOnInit(): void {
    // nothing
  }

  getFuncTree(userid, sppid) {
    this.constantService.get(`dm/AdmGrant/getLstGroupUser?userid=${userid}&sppid=${sppid}`).subscribe(res => {
      if (res) {
        this.dataGroups = res;
        this.dataGroups.forEach(dt => dt.direction = dt.userid ? 'right' : 'left');
      }
    });
  }

  handleOk() {
    const targetArr = [];
    for (const item of this.dataGroups) {
      if (item.direction === 'right') {
        targetArr.push(item.groupid);
      }
    }
    if (targetArr.length === 0) {
      this.toastrService.warning('Chưa lấy được tài khoản cho tên ' + name);
      return;
    }
    setTimeout(() => {
      const payload = {
        ...this.dataState,
        lstGroups: targetArr,
        sppid: this.cookieService.get(this.constantService.ID_SPP)
      };
      this.constantService.postRequest(this.constantService.QUAN_LY_AN + 'AdmGrant/saveGrantGroupsToUser', payload).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success('Phân quyền theo nhóm cho NSD thành công');
          } else {
            this.toastrService.error('Có lỗi khi phân quyền theo nhóm cho NSD');
          }
        }).catch(err => {
        this.toastrService.error('Có lỗi khi thực hiện: ' + err);
      })
    }, 100);
  }

  goToBack() {
    history.back();
  }
}
