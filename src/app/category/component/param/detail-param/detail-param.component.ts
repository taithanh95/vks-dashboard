import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ConstantService} from '../../../../common/constant/constant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {Param} from '../../../model/category.model';

@Component({
  selector: 'app-detail-param',
  templateUrl: './detail-param.component.html',
  styleUrls: ['./detail-param.component.css']
})
export class DetailParamComponent implements OnInit {
  @Input()
  editData: Param;
  isLoading = false;
  submited = false;
  inProgress: boolean = false;

  formData: FormGroup = this.fb.group({
    group: ['', [Validators.required]],
    code: ['', [Validators.required]],
    value: ['', [Validators.required]],
    name: [''],
    status: ['']
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
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/createOrUpdate/'
      , this.formData.value).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.toastrService.success( 'Thực hiện thành công');
          this.closeDialog();
        } else {
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
        this.isLoading = false;
      });
  }
}
