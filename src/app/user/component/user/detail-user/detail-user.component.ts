import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {AdmGroups, GroupRole, GroupUser, Inspector, User} from '../../../../category/model/category.model';
import {NumberService} from '../../../../common/util/number.service';
import {ResponseCode} from '../../../../common/constant/response-code';
import {CookieService} from 'ngx-cookie-service';
import {DateService} from '../../../../common/util/date.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @Input() editData: User;
  submited = false;
  isLoading: boolean = false;
  listGroupRole: GroupRole[];
  listGroupUser: GroupUser[];

  listSpp: any[];
  listGroup: AdmGroups[];
  listInspectors: Inspector[];
  // listDepart: AdmDepartment[];
  listDepart: any[];

  spp: string;

  sppId: string;
  formData: FormGroup;
  againtPasswork: any;

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService,
              private numberService: NumberService,
              private cookieService: CookieService,
              private dateService: DateService
  ) {
    this.sppId = this.cookieService.get(this.constantService.ID_SPP);
  }

  ngOnInit(): void {
    this.resetData();
    this.getListGroupUser();
  }

  resetData() {
    this.formData = this.fb.group({
      id: [''],
      status: [''],
      username: ['', [Validators.required]],
      password: [''],
      groupUserId: [''],
      name: ['', [Validators.required]],
      phone: [''],
      type: ['1', [Validators.required]],
      email: [''],
      departid: [''],
      sppid: [this.cookieService.get(this.constantService.ID_SPP), [Validators.required]],
      inspcode: ['', [Validators.required]],
      expiredate: [''],
      groupid: [''],
      againtPasswork: [''],
      sppname: [''],
      departname: [''],
      inspectname: [''],
      groupidname: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      if (this.editData && this.editData.id) {
        this.editData.password = '';
        this.formData.patchValue(this.editData);
        this.getListGroupRole(this.editData.id);
      } else {
        this.editData = {username: '', name: '', phone: '', status: 1};
      }
      this.sppidChange();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
    this.resetData();
  }

  closeDialog(): void {
    this.activeModal.close();
  }

  onSubmit() {
    this.submited = true;
    let valid = true;

    if (this.formData.value.password && this.formData.value.againtPasswork &&
      this.formData.value.password !== this.formData.value.againtPasswork) {
      this.toastrService.warning('Mật khẩu và nhập lại mật khẩu không giống nhau, cần kiểm tra lại');
      return;
    }

    if (!this.formData.value.username) {
      this.toastrService.warning('Tên đăng nhập bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.password && !this.editData && !this.editData.id) {
      this.toastrService.warning('Mật khẩu bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.againtPasswork && !this.editData && !this.editData.id) {
      this.toastrService.warning('Nhập lại mật khẩu bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.name) {
      this.toastrService.warning('Tên bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.sppid) {
      this.toastrService.warning('Viện kiểm sát bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.inspcode) {
      this.toastrService.warning('Cán bộ bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.valid) {
      this.toastrService.warning('Các trường đầu vào đang không đúng!');
      valid = false;
    }
    if (valid) {
      this.handleSaveUser();
    } else {
      this.isLoading = false;
    }
  }

  async handleSaveUser() {
    try {
      const msg = this.editData.id ? 'Cập nhật' : 'Thêm mới';
      this.isLoading = true;
      await this.handleSaveUserOld();
      const saveUserNew = await this.handleSaveUserNew();
      const resJson = saveUserNew.json();
      if (resJson.responseCode === '0000') {
        this.toastrService.success(`${msg} tài khoản thành công`);
      } else {
        this.toastrService.error(resJson.responseCode + ' - ' + resJson.responseMessage);
      }
      this.isLoading = false;
      this.reload.emit();
      this.handleCancel();
    } catch (err) {
      const meserr = err.json();
      this.toastrService.error(meserr.detail);
      this.isLoading = false;
    }
  }

  async handleSaveUserOld() {
    if (this.editData && this.editData.id) {
      await this.constantService.postRequest(this.constantService.API_QUANLYAN + 'user/handleInsOrUpdUserOld'
        , {
          user: {
            ...this.formData.value,
            password: btoa(this.formData.value.password)
          },
          action: 'U',
          sppid: this.formData.value.sppid,
          inspcode: this.formData.value.inspcode,
          expiredate: this.formData.value.expiredate,
          departid: this.formData.value.departid,
          groupid: this.formData.value.groupid,
        }
      ).toPromise();
    } else {
      return this.constantService.postRequest(this.constantService.API_QUANLYAN + 'user/handleInsOrUpdUserOld'
        , {
          user: {
            'username': this.formData.value.username,
            'password': btoa(this.formData.value.password),
            'name': this.formData.value.name,
            'groupUserId': this.formData.value.groupUserId,
            'email': this.formData.value.email,
            'type': this.formData.value.type,
            'phone': this.formData.value.phone,
            'sppid': this.formData.value.sppid,
            'inspcode': this.formData.value.inspcode,
            'expiredate': this.formData.value.expiredate,
            'departid': this.formData.value.departid,
            'groupid': this.formData.value.groupid
          },
          sppid: this.formData.value.sppid,
          inspcode: this.formData.value.inspcode,
          expiredate: this.formData.value.expiredate,
          departid: this.formData.value.departid,
          groupid: this.formData.value.groupid,
          action: 'I'
        }).toPromise();
    }
  }

  async handleSaveUserNew() {
    // console.log('formdata: ', this.formData.value);
    // console.log('listDepart: ', this.listDepart);
    // console.log('lstSpp', this.listSpp);
    const sppname = this.listSpp.find(dt => dt.SPPID === this.formData.value.sppid)?.NAME;
    const departname = this.listDepart.find(dt => dt.sppid === this.formData.value.departid)?.name;
    const inspectname = this.listInspectors.find(dt => dt.inspcode === this.formData.value.inspcode)?.fullname;
    const groupidname = this.listGroup.find(dt => dt.groupid === this.formData.value.groupid)?.groupname;

    if (sppname) {
      this.formData.value.sppname = sppname;
    }
    if (departname) {
      this.formData.value.departname = departname;
    }
    if (inspectname) {
      this.formData.value.inspectname = inspectname;
    }
    if (groupidname) {
      this.formData.value.groupidname = groupidname;
    }

    if (this.editData && this.editData.id) {
      return this.constantService.postRequest(this.constantService.AUTH_URI + 'user/update/'
        , {user: this.formData.value}).toPromise();
    } else {
      return this.constantService.postRequest(this.constantService.AUTH_URI + 'user/create/'
        , {
          user: {
            'username': this.formData.value.username,
            'password': btoa(this.formData.value.password),
            'name': this.formData.value.name,
            'groupUserId': this.formData.value.groupUserId,
            'email': this.formData.value.email,
            'type': this.formData.value.type,
            'phone': this.formData.value.phone,
            'sppid': this.formData.value.sppid,
            'inspcode': this.formData.value.inspcode,
            'expiredate': this.formData.value.expiredate,
            'departid': this.formData.value.departid,
            'groupid': this.formData.value.groupid,
            'sppname': sppname,
            'departname': departname,
            'inspectname': inspectname,
            'groupidname': groupidname,
          }
        }).toPromise();
    }
  }

  public changeStatusUserGroupRole(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn ' + (formData.status === 1 ? 'loại bỏ' : 'gán') + ' chức năng [' + formData.name + '] ?')
      .then((confirmed) => {
          if (confirmed) {
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.AUTH_URI + 'role/mergeUserGroupRole/'
              , {
                'groupRoleId': formData.id,
                'userId': this.editData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.getListGroupRole(this.editData.id);
                  this.toastrService.success('Thực hiện thành công');
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
                }
              })
              .catch(err => {
                this.toastrService.error('Hệ thống không có phản hồi.' + err);
              });
            this.ref.markForCheck();
          } else {
            this.getListGroupRole(this.editData.id);
          }
        }
      )
      .catch(() => {
        this.getListGroupRole(this.editData.id);
        console.log('Người dùng thoát hộp thoại hiện lên mà không ấn vào nút Đồng ý.');
      });
  }

  getListGroupRole(userId: number) {
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/findGroupRoleByUserId/'
      , {
        'userId': userId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listGroupRole = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listGroupRole = new Array<GroupRole>();
          this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
  }

  public upUserGroupRole(formData) {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/upUserGroupRole/'
      , {
        'userId': this.editData.id,
        'groupRoleId': formData.id,
        'priority': formData.priority
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Thực hiện thành công');
          this.getListGroupRole(this.editData.id);
        } else {
          this.toastrService.warning(responseBody.responseCode + ' - ' + responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.isLoading = false;
  }

  public downUserGroupRole(formData) {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/downUserGroupRole/'
      , {
        'userId': this.editData.id,
        'groupRoleId': formData.id,
        'priority': formData.priority
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Thực hiện thành công');
          this.getListGroupRole(this.editData.id);
        } else {
          this.toastrService.warning(responseBody.responseCode + ' - ' + responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.isLoading = false;
  }

  getListGroupUser() {
    this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/getListGroupUser/'
      , {
        'status': 1
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === '0000') {
          this.listGroupUser = responseBody.responseData;
        } else {
          this.listGroupUser = new Array<GroupUser>();

          this.toastrService.warning(responseBody.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  // Nang cap

  sppidChange() {
    this.loadOptions();
    this.getListInspector(this.formData.value.departid ? this.formData.value.departid : this.formData.value.sppid ? this.formData.value.sppid : null);
  }

  loadOptions() {
    let sppid = this.sppId;
    if (this.formData.value.sppid) {
      sppid = this.formData.value.sppid;
    }

    this.getListGroupOfSpp(this.sppId, sppid);
    this.getLstDepart(sppid);
    this.getListSpps(this.sppId, ' ');
  }

  getListGroupOfSpp(csppid, sppid) {
    this.constantService.get('/dm/AdmGrant/getLstGroupOfSpp/', {csppid: csppid, sppid: sppid})
      .subscribe(resJson => {
        // if (resJson) {
        //   this.listGroup = resJson;
        //   const insp = this.formData.value.groupid;
        //   const checksome = this.listGroup.some(dt => dt.groupid === insp);
        //   if (!checksome) {
        //     this.getItem('groupid').setValue('');
        //   }
        // } else {
        //   this.listGroup = [];
        //   this.getItem('groupid').setValue('');
        // }
        if (resJson != null) {
          this.listGroup = resJson;
        }
      }, (err) => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  getLstDepart(sppId) {
    this.constantService.get(`dm/AdmDepertments/getListSpp?sppid=${sppId}`)
      .subscribe(resJson => {
        if (resJson != null) {
          this.listDepart = resJson;
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  getListSpps(sppid, query) {
    this.constantService.get('/dm/LstSPP/getSpps', {sppid: sppid, query: query})
      .subscribe(resJson => {
        if (resJson != null) {
          this.listSpp = resJson;
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  getListInspector(sppid) {
    this.constantService.get(`/dm/AdmUsers/getLstInspector?sppid=${sppid}`)
      .subscribe(resJson => {
        if (resJson) {
          this.listInspectors = resJson;
          const insp = this.formData.value.inspcode;
          const checksome = this.listInspectors.some(dt => dt.inspcode === insp);
          if (!checksome) {
            this.getItem('inspcode').setValue('');
          }
        } else {
          this.listInspectors = [];
          this.getItem('inspcode').setValue('');
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        this.getItem('inspcode').setValue('');
        console.log(err);
      });
  }

  loadSppList(e: any) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listSpp = [];
    } else {
      this.getListSpps(this.sppId, value);
    }
  }

  departChange() {
    const sppid = this.formData.value.departid ? this.formData.value.departid : this.formData.value.sppid ? this.formData.value.sppid : null;
    this.getListInspector(sppid);
  }

  sppChange() {
    this.getItem('departid').setValue('');
    this.getItem('groupid').setValue('');
    const sppid = this.formData.value.sppid ? this.formData.value.sppid : null;
    this.getLstDepart(sppid);
    this.getListGroupOfSpp(this.sppId, sppid);
    this.getListInspector(this.formData.value.departid ? this.formData.value.departid : sppid);
  }

  getItem(item) {
    return this.formData.get(item);
  };

  onDateValueChange(event: Event, formControl: AbstractControl): void {
    const value = (event.target as HTMLInputElement).value;
    try {
      if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
        const date = this.dateService.stringToDate(value);
        if (formControl === this.formData.value.expiredate) {
          formControl.setValue(date.setHours(0, 0, 0));
        } else {
          formControl.setValue(date);
        }
      }
    } catch (error) {
      this.toastrService.error(error.message);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  checkPasswork() {
    const ex = this.formData.value.password;
    const reg = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$';
    // const value = String(ex).match(new RegExp(reg));
    if (!String(ex).match(new RegExp(reg))) {
      this.formData.get('password').setErrors({error: 'Mật khẩu phải có ít nhất 8 ký tự, gồm ít nhất 3 yếu tố: Chữ hoa, chữ thường, chữ số và ký tự đặc biệt!'});
    }
  }

  checkPassworkAgaint() {
    const ex = this.formData.value.password;
    const np = this.formData.value.againtPasswork;
    if (ex !== np) {
      this.formData.get('againtPasswork').setErrors({error: 'Mật khẩu không trùng khớp!'});
    }
  }

}
