import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../../../../common/constant/constant.service';

@Component({
  selector: 'app-inspector-edit',
  templateUrl: './inspector-edit.component.html',
  styleUrls: ['./inspector-edit.component.css']
})
export class InspectorEditComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private constantService: ConstantService,
    private toastrService: ToastrService
  ) {
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.getListSpp();
      this.onInputSppIsDepart();
      if (this.data.POSITION) {
        const lstPosition = this.data.POSITION.split(',');
        lstPosition.forEach(data => {
          if (data === 'KS') {
            this.data.ks = true;
          } else if (data === 'DT') {
            this.data.dt = true;
          } else if (data === 'LD') {
            this.data.ld = true;
          } else if (data === 'KH') {
            this.data.kh = true;
          } else this.data.POSITION = null;
        });
      }
    }
  }

  ngOnInit(): void {

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
    payload.action = 'U';
    this.constantService.post('dm/LstInspector/insertOrUpdate', payload, null, 'text')
      .toPromise()
      .then(resj => resj.json)
      .then(res => {
        if (res) {
          this.toastrService.error('Có lỗi khi cập nhật người xử lý');
        } else {
          this.toastrService.success('Cập nhật người xử lý thành công');
          this.handleCancel();
          this.reload.emit();
        }
        this.loading = false;
      }, () => {
        this.toastrService.error('Có lỗi khi cập nhật người xử lý');
        this.loading = false;
      });
  }

  changStatus() {
  }

  getListSpp(): void {
    this.constantService.get('dm/LstInspector/getListSpp',
      {
        sppid: this.data?.SPPID
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
