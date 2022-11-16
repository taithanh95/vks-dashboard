import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConstantService} from '../../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-adm-group-user-create',
  templateUrl: './adm-group-user-create.component.html',
  styleUrls: ['./adm-group-user-create.component.css']
})
export class AdmGroupUserCreateComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  sppid: string;

  titleName = 'Thêm mới';

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
  ) {
    this.sppid = this.cookieService.get(this.constantService.ID_SPP);
  }

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.titleName = this.data.isEdit ? 'Cập nhật' : 'Thêm mới';
    }
  }

  handleOk() {
    if (!this.data.groupname) {
      this.toastrService.error('Bạn phải nhập giá trị cho trường Tên nhóm NSD');
      return;
    }
    this.doSave();
  }

   doSave() {
    let msg, action;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
    } else {
      msg = 'Thêm mới';
      action = 'I';
    }
    const payload = {
      ...this.data,
      sppid: this.sppid,
      action: action
    };
     this.constantService.postRequest(this.constantService.QUAN_LY_AN + 'AdmGroups/save', payload)
       .toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000' && !resJson.responseData) {
            this.toastrService.success(`${msg} thành công`);
            this.handleReload();
          } else if (resJson.responseData === 'adm_Groups.messages.groupNameExist') {
            this.toastrService.warning('Tên nhóm người sử dụng đã tồn tại');
          } else
            this.toastrService.error('Lỗi khi thêm mới nhóm người sử dụng');

        }).catch(err => {
        this.toastrService.error('Có lỗi khi thực hiện: ' + err);
      });
  }

  doReset() {
    this.data = {
      groupid: '',
      groupname: '',
      isEdit: false
    };
  }

  handleReload() {
    this.reloadModal.emit(false), this.isVisible = false;
  }

  handleCancel() {
    this.closeModal.emit(false), this.isVisible = false;
  }
}
