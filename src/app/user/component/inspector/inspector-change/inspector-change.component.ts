import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ConstantService} from '../../../../common/constant/constant.service';


@Component({
  selector: 'app-inspector-change',
  templateUrl: './inspector-change.component.html',
  styleUrls: ['./inspector-change.component.css']
})
export class InspectorChangeComponent implements OnInit, OnChanges {
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
      this.lstSppIsDepart = [];
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
          } else {
            this.data.POSITION = null;
          }
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
    console.log('handleSubmit: ', data);
    let payload = {
      ...data,
      sppid: data.sppidchange
    };
    this.constantService.postRequest(this.constantService.QUAN_LY_AN + 'LstInspector/changeInspector', payload)
      .toPromise()
      .then(res => {
        if (res) {
          this.toastrService.success('Điều chuyển người xử lý thành công');
          this.handleCancel();
          this.reload.emit();
        } else {
          this.toastrService.error('Có lỗi khi Điều chuyển người xử lý ');
        }
        this.loading = false;
      }, () => {
        this.toastrService.error('Có lỗi khi Điều chuyển người xử lý ');
        this.loading = false;
      });
  }

  onInputSPP(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSppIsDepart = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.getListSppAutoComplete(value, this.data?.SPPID).subscribe(res => {
        this.lstSppIsDepart = res;
      });
    }
  }

  getListSppAutoComplete(query: any, sppid: any): Observable<any[]> {
    if (query === ' ') {
      query = '0';
    }
    return this.constantService.get(`/dm/LstSPP/autocompleteForChangeInsp/${query}/${sppid}`, null);
  }
}
