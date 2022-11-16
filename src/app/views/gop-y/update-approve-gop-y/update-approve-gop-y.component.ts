import {Component, Input, OnInit} from '@angular/core';
import {FeedBack, ResponseBody} from '../../../common/model/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ResponseCode} from '../../../common/constant/response-code';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {Constant} from '../../../common/constant/constant';

@Component({
  selector: 'app-update-approve-gop-y',
  templateUrl: './update-approve-gop-y.component.html',
  styleUrls: ['./update-approve-gop-y.component.css']
})
export class UpdateApproveGopYComponent implements OnInit {
  @Input() filter: FeedBack = null;
  isLoading = false;
  formData: FormGroup;
  approveBy: string;
  sppid: string;
  constructor(
    private fb: FormBuilder,
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private modal: NzModalRef,
    private modal2: NzModalService,

  ) { }
  ngOnInit(): void {
    this.initForm();
    this.approveBy = localStorage.getItem(Constant.username_label)
    +" - " + localStorage.getItem(Constant.sppname_label);
    this.sppid = localStorage.getItem(Constant.sppid_label);
  }
  initForm(){
    this.formData = this.fb.group({
      contentApprove: [null]
    });
}
  approve(request: FeedBack){
    if(request.contentApprove == null){
      this.toastrService.warning("Bạn phải nhập nội dung phê duyệt.");
      return;
    }
    const modalRef: NzModalRef = this.modal2.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn đồng ý phê duyệt không?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Không',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'Có',
      nzOnCancel: () => {
        setTimeout(() => {
          let body = {...request, id: this.filter.id, approve: 'Y', sppid: this.sppid, approveBy: this.approveBy }
          this.changeApprove(body);
          modalRef.close();
        }, 500);
      }
    });
    modalRef.afterClose.subscribe(() => {
    });
  }
  disapprove(request: FeedBack){
    if(request.contentApprove == null) {
      this.toastrService.warning("Bạn phải nhập nội dung phê duyệt.");
      return;
    }
    const modalRef: NzModalRef = this.modal2.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn từ chối phê duyệt không?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Không',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'Có',
      nzOnCancel: () => {
        setTimeout(() => {
          let body = {...request, id: this.filter.id, approve: 'N', sppid: this.sppid, approveBy: this.approveBy }
          this.changeApprove(body);
          modalRef.close();
        }, 500);
      }
    });
    modalRef.afterClose.subscribe(() => {
    });
  }
  changeApprove(body: Object){
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'feedback/changeFeedBackApprove/',
      body)
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success(respJson.responseMessage);
          this.resetForm();
          this.closeDialog();
        }
        else {
          this.toastrService.error(respJson.responseMessage);
        }
        this.isLoading = false;
      }).catch(() =>{
      this.isLoading = false;
      this.toastrService.error("Lỗi hệ thống");
    });
  }
  closeDialog(): void {
    this.modal.destroy({data: 'this the result data'});
  }
  resetForm(): void {
    this.formData.reset();
  }
}
