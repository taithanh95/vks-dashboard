import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../../../../common/constant/constant.service';

@Component({
  selector: 'app-inspector-create',
  templateUrl: './inspector-create.component.html',
  styleUrls: ['./inspector-create.component.css']
})
export class InspectorCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  data: any;
  sppId = this.cookieService.get(this.constantService.ID_SPP);
  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private cookieService: CookieService,
    private constantService: ConstantService,
    private toastrService: ToastrService
  ) {
  }


  ngOnChanges(): void {
    if (this.isVisible) {
      this.data.STATUS = 'Y';
      this.getListSpp();
      this.onInputSppIsDepart();
    }
  }

  ngOnInit(): void {
    this.data = {}
  }

  resetData() {
    this.data = {}
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.FULLNAME) {
      this.toastrService.error('Tên người xử lý buộc phải nhập');
      valid = false;
    }
    if (!this.data.ks && !this.data.dt && !this.data.ld && !this.data.kh) {
      this.toastrService.error('Vị trí công tác buộc phải nhập');
      valid = false;
    }
    if (!this.data.STATUS) {
      this.toastrService.error('Trạng thái làm việc buộc phải nhập');
      valid = false;
    }
    if (!this.data.SPPID) {
      this.toastrService.error('Tên VKS buộc phải nhập');
      valid = false;
    }
    if (valid) {
      this.isSubmited = false;
      this.handleSubmit(this.data);
    } else {
      this.loading = false;
    }
  }

  handleSubmit(data) {
    let payload = data;
    this.resetData();
    payload.action = 'I';
    this.constantService.post( 'dm/LstInspector/insertOrUpdate',payload, null, 'text')
    .subscribe(res => {
      if (res) {
        this.toastrService.error('Có lỗi khi Thêm mới người xử lý');
      } else {
        this.handleCancel();
        this.toastrService.success('Thêm mới người xử lý thành công');
        this.reload.emit();
      }
      this.loading = false;
    }, () => {
      this.toastrService.error('Có lỗi khi Thêm mới người xử lý');
      this.loading = false;
    });
  }

  changStatus() {
  }

  getListSpp(): void {
    this.constantService.get('dm/LstInspector/getListSpp',
      {
        sppid: this.sppId
      }
    ).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
    }, () => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppIsDepart(): void {
    this.constantService.get('dm/LstInspector/getListSppIsDepart',
      {
        sppid: this.data?.SPPID
      }
    ).subscribe(res => {
      this.loading = false;
      this.lstSppIsDepart = res;
    }, () => {
      alert('Lỗi dữ liệu');
    });
  }
}
