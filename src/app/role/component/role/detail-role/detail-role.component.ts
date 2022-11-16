import {Component, Input, OnInit} from '@angular/core';
import {Role} from '../../../../category/model/category.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';

@Component({
  selector: 'app-detail-role',
  templateUrl: './detail-role.component.html',
  styleUrls: ['./detail-role.component.css']
})
export class DetailRoleComponent implements OnInit {
  @Input()
  editData: Role;
  isLoading = false;
  submited = false;
  listParent: Role[];

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    type: [''],
    parentId: [''],
    name: [''],
    description: [''],
    url: [''],
    icon: ['']
  });

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.getListParent();
    if (this.editData) {
      this.formData.patchValue(this.editData);
    }
  }

  getListParent() {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/getParentRole/'
      , {}).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listParent = resJson.responseData;
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        this.isLoading = false;
      });
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
      this.constantService.postRequest(this.constantService.AUTH_URI + 'role/updateRole/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success('Chỉnh sửa thành công');
            this.closeDialog();
          } else {
            this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.error('Hệ thống không có phản hồi.');
          this.isLoading = false;
        });
    } else {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'role/createRole/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success('Thêm mới thành công');
            this.closeDialog();
          } else {
            this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.error('Hệ thống không có phản hồi.');
          this.isLoading = false;
        });
    }
  }


}
