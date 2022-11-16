import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ConstantService} from '../../../../common/constant/constant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {Email, EmailSearch} from '../../../model/category.model';

@Component({
  selector: 'app-detail-email',
  templateUrl: './detail-email.component.html',
  styleUrls: ['./detail-email.component.css']
})
export class DetailEmailComponent implements OnInit {
  @Input()
  editData: Email;
  isLoading = false;
  submited = false;
  searchModel: EmailSearch;
  inProgress: boolean = false;

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    toAddress: ['', [Validators.required]],
    ccAddress: [''],
    subject: ['', [Validators.required]],
    content: ['', [Validators.required]],
    intendAt: [''],
    sentAt: ['']
  });

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    if (this.editData) {
      this.formData.patchValue(this.editData);
      this.getContentById(this.editData.id);
    }
  }

  closeDialog(): void {
    this.activeModal.close();
  }

  onSubmit() {
    this.submited = true;
    if (this.formData.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.editData && this.editData.id) {
      this.constantService.postRequest(this.constantService.NOTIFICATION_URI + 'email/update/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Chỉnh sửa thành công');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
        });
    } else {
      this.constantService.postRequest(this.constantService.NOTIFICATION_URI + 'email/create/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Thêm mới thành công');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
        });
    }
    this.isLoading = false;
  }

  private getContentById(id: number) {
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.NOTIFICATION_URI + 'email/getContentById/'
      , {
        'id': id
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.formData.controls['content'].setValue(resJson.responseData);
        } else {
          // tslint:disable-next-line:max-line-length
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
        this.inProgress = false;
      });
  }
}
