import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Supplier, SupplierSearch} from '../../../model/category.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-detail-supplier',
  templateUrl: './detail-supplier.component.html',
  styleUrls: ['./detail-supplier.component.css']
})
export class DetailSupplierComponent implements OnInit {

  @Input()
  editData: Supplier;
  isLoading = false;
  submited = false;
  searchModel: SupplierSearch;
  inProgress: boolean = false;

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    name: [''],
    address: [''],
    code: [''],
    taxCode: [''],
    moduleName: [''],
    phone: [''],
    alias: ['']
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
    if (this.editData && this.editData.id) {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'supplier/update/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Ch???nh s???a th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'C?? l???i khi th???c hi???n: ' + err);
        });
    } else {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'supplier/create/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Th??m m???i th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'C?? l???i khi th???c hi???n: ' + err);
        });
    }
    this.isLoading = false;
  }
}
