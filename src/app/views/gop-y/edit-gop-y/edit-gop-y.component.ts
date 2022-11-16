import {Component, Input, OnInit} from '@angular/core';
import {FeedBack, ResponseBody} from '../../../common/model/base.model';
import {Constant} from '../../../common/constant/constant';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ResponseCode} from '../../../common/constant/response-code';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-gop-y',
  templateUrl: './edit-gop-y.component.html',
  styleUrls: ['./edit-gop-y.component.css']
})
export class EditGopYComponent implements OnInit {
  @Input() filter: FeedBack = null;

  isLoading = false;
  formData: FormGroup;
  listType = Constant.LST_TYPE;
  listSubType = Constant.LST_SUB_TYPE;
  updatedBy: string;
  constructor(
    private fb: FormBuilder,
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private modal: NzModalRef,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.updatedBy = localStorage.getItem(Constant.username_label)
      + " - "+ localStorage.getItem(Constant.sppname_label);
  }
  initForm(): void {
    this.formData = this.fb.group({
      id: this.filter.id,
      content: this.filter.content,
      type: this.filter.type,
      subType: this.filter.subType,
      phoneNumber: this.filter.phoneNumber,
      email:this.filter.email,
    });
  }
  onSubmit(): void {
    let valid = true;
    let content = this.formData.value.content;
    let type = this.formData.value.type;
    let subType = this.formData.value.subType;
    let phoneNumber = this.formData.value.phoneNumber;
    let email = this.formData.value.email;
    if( content == this.filter.content && type == this.filter.type && email == this.filter.email
      && subType == this.filter.subType && phoneNumber == this.filter.phoneNumber){
      this.toastrService.warning("Thông tin cập nhật chưa được chỉnh sửa");
      valid = false;
    }
    if( content == null || content.trim() =='' ){
      this.toastrService.warning("Bạn phải nhập nội dung cho câu hỏi!");
      valid = false;
    }
    if( phoneNumber == null || phoneNumber.trim()== ''){
      this.toastrService.warning("Bạn phải nhập số điện thoại!");
      valid = false;
    }
    if( type == null){
      this.toastrService.warning("Bạn phải chọn nhóm nội dung!");
      valid = false;
    }
    if( subType == null && type != '00'){
      this.toastrService.warning("Bạn phải chọn mục nội dung!");
      valid = false;
    }
    if(valid == false){
      return;
    }
    let feedBack :FeedBack = { id:this.filter.id,
      content:content,
      type:type,
      subType: subType,
      phoneNumber: phoneNumber,
      email: email,
      updatedBy: this.updatedBy,
    }
    this.updateFeedBack(feedBack)
  }
  updateFeedBack(feedBack: FeedBack){
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'feedback/createOrUpdateFeedback/',
      feedBack
    )
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success(respJson.responseMessage);
          this.closeDialog();
          this.resetForm();
        }
        else if (respJson.responseCode === '0007') {
          this.toastrService.warning(respJson.responseMessage);
        }
        else{
          this.toastrService.error(respJson.responseMessage);
        }
      }).catch(() =>{

    });
  }
  closeDialog(): void {
    this.modal.destroy({data: 'this the result data'});
  }
  resetForm(): void {
    this.formData.reset();
  }
  changeValueType(){
    this.formData.get('subType').setValue(null);
  }
}
