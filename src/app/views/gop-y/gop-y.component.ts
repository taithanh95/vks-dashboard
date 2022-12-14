import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ConstantService} from '../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {Constant} from '../../common/constant/constant';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FeedBack, ResponseBody} from '../../common/model/base.model';
import {ResponseCode} from '../../common/constant/response-code';
import {DateService} from '../../common/util/date.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {CreateGopYComponent} from './create-gop-y/create-gop-y.component';
import {EditGopYComponent} from './edit-gop-y/edit-gop-y.component';
import {CommentGopYComponent} from './comment-gop-y/comment-gop-y.component';
import {UpdateApproveGopYComponent} from './update-approve-gop-y/update-approve-gop-y.component';


@Component({
  selector: 'app-gop-y',
  templateUrl: './gop-y.component.html',
  styleUrls: ['./gop-y.component.css']
})
export class GopYComponent implements OnInit {
  isLoading = false;
  formData: FormGroup;
  colsTable: any;

  lstFeedBack: FeedBack[] = [];
  listType: any = Constant.LST_TYPE;
  listSubType: any = Constant.LST_SUB_TYPE;
  listApprove: any = Constant.LST_APPROVE;
  sppid_VKSNDTC: string = Constant.sppid_VKSNDTC;
  scroll = null;
  totalElements = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  sppid: any;
  urlGetList: string;
  bodyGetList: any;
  permission_delete_update: boolean = false;
  createdBy: string;

  constructor(
    private fb: FormBuilder,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private dateService: DateService,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
  ) {
    this.sppid = localStorage.getItem(Constant.sppid_label);
  }

  ngOnInit(): void {
    this.createdBy = localStorage.getItem(Constant.username_label)
      + ' - ' + localStorage.getItem(Constant.sppname_label);
    this.initFormAndTable();
    this.urlGetList = 'feedback/getListFeedBack/';
    this.bodyGetList = {
      fromDate: this.formData.value.fromDate,
      toDate: this.formData.value.toDate,
      sppid: this.sppid
    };
    this.getListFeedBack(this.urlGetList, this.bodyGetList);
  }

  initFormAndTable(): void {
    this.formData = this.fb.group({
      createdBy: [null],
      content: [null],
      fromDate: [this.dateService.getFirstDayOfMonth(), [Validators.required]],
      toDate: [this.dateService.getCurrentDate(), [Validators.required]],
      type: [null],
      subType: [null],
      approve: [null]
    });
    this.colsTable = [
      {
        title: 'STT',
        width: '3%'
      },
      {
        title: 'Ng?????i ????ng',
        width: '8%'
      },
      {
        title: 'C??u h???i',
        width: '25%'
      },
      {
        title: 'Ng??y ????ng',
        width: '7%'
      },
      {
        title: 'Nh??m n???i dung',
        width: '12%'
      },
      {
        title: 'Tr???ng th??i',
        width: '8%'
      },
      {
        title: 'Thao t??c',
        width: '10%'
      }];
  }

  validSearch(request: FeedBack): boolean {
    let valid = true;
    if (request.fromDate == null) {
      this.toastrService.warning('B???n ph???i nh???p t??? ng??y');
      valid = false;
    }
    if (request.toDate == null) {
      this.toastrService.warning('B???n ph???i nh???p ?????n ng??y');
      valid = false;
    }
    const fromDate = this.dateService.convertTimeToBeginningOfTheDay(request.fromDate);
    const toDate = this.dateService.convertTimeToEndingOfTheDay(request.toDate);
    if (fromDate.getTime() > toDate.getTime()) {
      this.toastrService.warning('T??? ng??y ph???i nh??? h??n ?????n ng??y');
      this.fromDate.setValue(null);
      valid = false;
    }
    if (fromDate.getTime() > new Date().getTime()) {
      this.toastrService.warning(`T??? ng??y kh??ng l???n h??n ng??y hi???n t???i ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
      this.fromDate.setValue(null);
      valid = false;
    }
    if (toDate.getTime() > new Date().getTime() && toDate.getDate() != new Date().getDate()) {
      this.toastrService.warning(`?????n ng??y kh??ng l???n h??n ng??y hi???n t???i ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
      this.toDate.setValue(null);
      valid = false;
    }
    return valid;
  }

  onSearch(request: FeedBack): void {
    if (this.validSearch(request) == false) {
      return;
    }
    this.urlGetList = 'feedback/getListFeedBack/';
    this.bodyGetList = {
      ...request, sppid: this.sppid
    };
    this.permission_delete_update = false;
    this.getListFeedBack(this.urlGetList, this.bodyGetList);
  }

  onSearchByCreatedBy(request: FeedBack) {
    if (this.validSearch(request) == false) {
      return;
    }
    this.urlGetList = 'feedback/getListFeedBackByCreatedBy/';
    this.bodyGetList = {...request,
      createdBy: localStorage.getItem(Constant.username_label)
        + " - " + localStorage.getItem(Constant.sppname_label)
    };
    this.permission_delete_update = true;
    this.getListFeedBack(this.urlGetList, this.bodyGetList);
  }

  getListFeedBack(url: string, body: any) {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.SOTHULY_URI + url, body)
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        this.isLoading = false;
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.lstFeedBack = respJson.responseData;
          this.totalPages = this.getTotalPagesOfList();
          this.totalElements = this.getTotalElements();
        } else if (respJson.responseCode === '0007') {
          this.toastrService.warning(respJson.responseMessage);
          this.lstFeedBack = null;
          this.totalPages = 1;
          this.totalElements = 0;
        } else {
          this.toastrService.warning(respJson.responseMessage);
        }
      }).catch(() => {
      this.isLoading = false;
      this.toastrService.error(this.constantService.SYSTEM_ERROR);
    });
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    this.dateService.onDateValueChange(event, formControl);
  }

  get fromDate(): AbstractControl {
    return this.formData.get('fromDate');
  }

  get toDate(): AbstractControl {
    return this.formData.get('toDate');
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  getTotalPagesOfList(): number {
    return Math.ceil(this.lstFeedBack.length / this.pageSize);
  }

  getTotalElements(): number {
    return this.lstFeedBack.length;
  }

  showModalCreate(filter?: FeedBack): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzTitle: 'Th??m m???i c??u h???i/g??p ??',
      nzContent: CreateGopYComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Ghi l???i',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'X??c nh???n',
            nzContent: 'B???n c?? ch???c ch???n mu???n l??u d??? li???u kh??ng?',
            nzOkType: 'default',
            nzOkText: 'Kh??ng',
            nzCancelText: 'C??',
            nzOnCancel: () => modalRef.getContentComponent().onSubmit()
          })
        },
        {
          label: 'H???y b???',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.urlGetList = 'feedback/getListFeedBackByCreatedBy/';
      this.bodyGetList = {
        ...this.bodyGetList, createdBy: this.createdBy
      };
      this.permission_delete_update = true;
      this.getListFeedBack(this.urlGetList, this.bodyGetList);
    });
  }

  showModalEdit(filter?: FeedBack): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzTitle: 'C???p nh???t c??u h???i/g??p ??',
      nzContent: EditGopYComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Ghi l???i',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'X??c nh???n',
            nzContent: 'B???n c?? ch???c ch???n mu???n l??u d??? li???u kh??ng?',
            nzOkType: 'default',
            nzOkText: 'Kh??ng',
            nzCancelText: 'C??',
            nzOnCancel: () => modalRef.getContentComponent().onSubmit()
          })
        },
        {
          label: 'H???y b???',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.urlGetList = 'feedback/getListFeedBackByCreatedBy/';
      this.permission_delete_update = true;
      this.bodyGetList = {
        ...this.bodyGetList, createdBy: this.createdBy
      };
      this.getListFeedBack(this.urlGetList, this.bodyGetList);
    });
  }

  showDeleteConfirm(id: string): void {
    const modalRef: NzModalRef = this.modal.confirm({
      nzTitle: 'X??c nh???n',
      nzContent: 'B???n c?? ch???c ch???n mu???n x??a b???n ghi kh??ng?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Kh??ng',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'C??',
      nzOnCancel: () => {
        setTimeout(() => {
          this.isLoading = true;
          this.constantService.postRequest(this.constantService.SOTHULY_URI + 'feedback/deleteFeedBack/',
            {id: id})
            .toPromise().then(resp => resp.json())
            .then((respJson: ResponseBody) => {
              if (respJson.responseCode === ResponseCode.SUCCESS) {
                this.toastrService.success('X??a th??nh c??ng');
                this.urlGetList = 'feedback/getListFeedBackByCreatedBy/';
                this.bodyGetList = {
                  ...this.bodyGetList, createdBy: this.createdBy
                };
                this.permission_delete_update = true;
                this.getListFeedBack(this.urlGetList, this.bodyGetList);

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

  showModalDetail(filter?: FeedBack): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '1050px',
      nzTitle: 'Th??ng tin chi ti???t c??u h???i/g??p ??',
      nzContent: CommentGopYComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Tho??t',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
    });
  }

  changeApprove(filter?: FeedBack): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '900px',
      nzTitle: 'Thay ?????i tr???ng th??i',
      nzContent: UpdateApproveGopYComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Tho??t',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.permission_delete_update = false;
      this.getListFeedBack('feedback/getListFeedBack/', this.bodyGetList);
    });
  }

  changeValueType() {
    this.formData.get('subType').setValue(null);
  }
}
