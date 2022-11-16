import {Component, Input, OnInit} from '@angular/core';
import {FeedBack, ResponseBody} from '../../../common/model/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constant} from '../../../common/constant/constant';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {ResponseCode} from '../../../common/constant/response-code';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-gop-y',
  templateUrl: './create-gop-y.component.html',
  styleUrls: ['./create-gop-y.component.css']
})
export class CreateGopYComponent implements OnInit {
  @Input() filter: FeedBack = null;

  isLoading = false;
  formData: FormGroup;
  listType = Constant.LST_TYPE;
  listSubType = Constant.LST_SUB_TYPE;

  createdBy: string;
  constructor(
    private fb: FormBuilder,
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private modal: NzModalRef,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.createdBy = localStorage.getItem(Constant.username_label)
      + " - "+ localStorage.getItem(Constant.sppname_label);
  }
  initForm(): void {
    this.formData = this.fb.group({
      content: this.filter.content,
      subType: this.filter.subType,
      type: this.filter.type,
      phoneNumber: null,
      email: null,
    });
  }
  onSubmit(): void {
    let valid = true;
    let content = this.formData.value.content;
    let type = this.formData.value.type;
    let subType = this.formData.value.subType;
    let email = this.formData.value.email;
    let phoneNumber = this.formData.value.phoneNumber;

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
    let feedBack :FeedBack = { content:content,
      type:type,
      subType: subType,
      email: email,
      phoneNumber: phoneNumber,
      createdBy: this.createdBy
    }
    this.saveFeedBack(feedBack)
  }
  saveFeedBack(feedBack: FeedBack){
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'feedback/createOrUpdateFeedback/',
      feedBack
    )
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.isLoading = false;
          this.toastrService.success(respJson.responseMessage);
          this.resetForm();
          this.closeDialog();
        }
        else if (respJson.responseCode === '0007') {
          this.isLoading = false;
          this.toastrService.warning(respJson.responseMessage);
        }
        else{
          this.isLoading = false;
          this.toastrService.error(respJson.responseMessage);
        }
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
  changeValueType(){
    this.formData.get('subType').setValue(null);
  }

  numberOnly(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
    // const pattern = /[0-9\+\-\ ]/;
    //
    // let inputChar = String.fromCharCode((event.which) ? event.which : event.keyCode);
    // if (event.keyCode != 8 && !pattern.test(inputChar)) {
    //   console.log('số điện thoại đúng');
    //   event.preventDefault();
    // }else {
    //   console.log('số điện thoại sai');
    // }
  }
}
