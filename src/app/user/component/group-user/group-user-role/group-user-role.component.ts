import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DefaultTreeviewI18n, TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {GroupRole} from '../../../../category/model/category.model';
import {ResponseCode} from '../../../../common/constant/response-code';
import {ConstantService} from '../../../../common/constant/constant.service';

@Component({
  selector: 'app-group-user-role',
  templateUrl: './group-user-role.component.html',
  styleUrls: ['./group-user-role.component.css'],
  providers: [
    {
      provide: TreeviewI18n, useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterPlaceholder(): string {
          return 'Tìm kiếm trong danh sách';
        },
        getAllCheckboxText(): string {
          return 'Tất cả';
        },
        getFilterNoItemsFoundText(): string {
          return 'Danh sách rỗng';
        },
        getTooltipCollapseExpandText(isCollapse: boolean): string {
          return isCollapse ? 'Mở rộng' : 'Thu nhỏ';
        }
        // also override other methods if needed
        // getText(selection: TreeviewSelection): string;
        // getAllCheckboxText(): string;
        // getFilterPlaceholder(): string;
        // getFilterNoItemsFoundText(): string;
        // getTooltipCollapseExpandText(isCollapse: boolean): string;
      })
    }
  ]
})
export class GroupUserRoleComponent implements OnInit {

  @Input()
  groupUserId: number;
  @Input()
  username: string;
  @Input()
  name: string;

  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 600
  });

  buttonClasses = [
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-outline-warning',
    'btn-outline-info',
    'btn-outline-light',
    'btn-outline-dark'
  ];
  buttonClass = this.buttonClasses[0];

  isLoading: boolean = false;
  listData: GroupRole[];

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService
  ) {
  }

  ngOnInit(): void {
    if (this.groupUserId) {
      this.getListData();
    }
  }

  closed(): void {
    this.activeModal.close();
  }

  save(): void {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/setGroupRoleAndRoleByGroupUserId/'
      , {
        'groupUserId': this.groupUserId,
        'items': this.items
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Thực hiện thành công');
          this.activeModal.close();
        } else {
          this.toastrService.warning(responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.toastrService.error('Hệ thống không có phản hồi.');
        console.log(err);
        this.isLoading = false;
      });
  }

  getListData() {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/getGroupRoleByGroupUserId/'
      , {
        'groupUserId': this.groupUserId
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.listData = responseBody.responseData;
          this.items = new Array<TreeviewItem>();
          this.listData.forEach(x => {
            let groupRole = new TreeviewItem({
              value: x.id,
              text: x.name,
              disabled: x.status !== 1,
              checked: x.checked,
              collapsed: false
            });
            let roleList = new Array<TreeviewItem>();
            if (x.children && x.children.length > 0) {
              x.children.forEach(y => {
                let role = new TreeviewItem({
                  value: y.id,
                  text: y.name,
                  disabled: y.status !== 1,
                  checked: y.checked,
                  collapsed: false
                });
                let methodList = new Array<TreeviewItem>();
                if (y.children && y.children.length > 0) {
                  y.children.forEach(z => {
                    const method = new TreeviewItem({
                      value: z.id,
                      text: z.name,
                      disabled: z.status !== 1,
                      checked: z.checked,
                      collapsed: false
                    });
                    methodList.push(method);
                  });
                }
                if (methodList && methodList.length > 0) {
                  role.children = methodList;
                }
                roleList.push(role);
              });
            }
            if (roleList && roleList.length > 0) {
              groupRole.children = roleList;
            }
            this.items.push(groupRole);
          });
        } else {
          this.toastrService.warning(responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.toastrService.error('Hệ thống không có phản hồi.');
        console.log(err);
        this.isLoading = false;
      });
  }

  onFilterChange(value: string): void {
    // console.log('this.items = ', this.items);
  }
}
