import {Component, Input, OnInit} from '@angular/core';
import {Comments, FeedBack, ResponseBody} from '../../../common/model/base.model';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {ResponseCode} from '../../../common/constant/response-code';
import {Constant} from '../../../common/constant/constant';

@Component({
  selector: 'app-comment-gop-y',
  templateUrl: './comment-gop-y.component.html',
  styleUrls: ['./comment-gop-y.component.css']
})
export class CommentGopYComponent implements OnInit {
  @Input() filter: FeedBack = null;

  isLoading = false;
  formData: FormGroup;
  listComment: Comments[] = [];
  listCommentIsEmpty: boolean = false;
  createdBy: string;
  listApprove = Constant.LST_APPROVE;
  listType = Constant.LST_TYPE;
  listSubType = Constant.LST_SUB_TYPE;
  typename: any;

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getListComments();
    this.createdBy = localStorage.getItem(Constant.username_label) + ' - ' + localStorage.getItem(Constant.sppname_label);
    if (this.filter.subType){
      this.typename = this.listType.get(this.filter.type) + ' - ' + this.listSubType.get(this.filter.type).get(this.filter.subType);
    }else {
      this.typename = this.listType.get(this.filter.type);
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      content: [null]
    });
  }

  getListComments() {
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'comment/getListByFeedBack/',
      {feedback: {id: this.filter.id}})
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.listComment = respJson.responseData;
          this.listCommentIsEmpty = false;
        } else if (respJson.responseCode === '0007') {
          this.listCommentIsEmpty = true;
          this.listComment = null;
        } else {
          this.toastrService.error(respJson.responseMessage);
        }
        this.isLoading = false;
      }).catch(() => {
      this.isLoading = false;
      this.listCommentIsEmpty = true;
      this.toastrService.error('Lỗi hệ thống');

    });
  }

  comment(request: Comments) {
    let valid = true;
    if (request.content == null || request.content == '') {
      this.toastrService.warning('Bạn chưa nhập nội dung comment');
      valid = false;
    }
    if (valid == false) {
      return;
    }
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'comment/createOrUpdateComment/',
      {...request, feedback: {id: this.filter.id}, createdBy: this.createdBy}
    )
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        this.isLoading = false;
        this.formData.reset();
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success(respJson.responseMessage);
          this.getListComments();
        } else if (respJson.responseCode === '0007') {
          this.toastrService.warning(respJson.responseMessage);
        } else {
          this.toastrService.error(respJson.responseMessage);
        }
      }).catch(() => {
      this.isLoading = false;
      this.formData.reset();
      this.toastrService.error('Lỗi hệ thống');
    });

  }

  deleteComment(request: Comments) {
    const modalRef: NzModalRef = this.modal.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa bình luận không?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Không',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'Có',
      nzOnCancel: () => {
        setTimeout(() => {
          this.isLoading = true;
          this.constantService.postRequest(this.constantService.SOTHULY_URI + 'comment/deleteComment/', {
            id: request.id,
            createdBy: this.createdBy
          })
            .toPromise().then(resp => resp.json())
            .then((respJson: ResponseBody) => {
              if (respJson.responseCode === ResponseCode.SUCCESS) {
                this.toastrService.success('Xóa thành công');
                this.getListComments();

              } else {
                this.toastrService.warning(respJson.responseMessage);
              }
              this.isLoading = false;
            }).catch(() => {
            this.toastrService.error(this.constantService.SYSTEM_ERROR);
            this.isLoading = false;
          });
          modalRef.close();
        }, 1000);
      }
    });
    modalRef.afterClose.subscribe(() => {
    });
  }
}
