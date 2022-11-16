import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

// Dropdowns Component
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
// Routing
import {UserRouting} from './user.routing';

// Components Routing
import {NgxPaginationModule} from 'ngx-pagination';
import {CommonComponentsModule} from '../shared/components/common-components.module';
import {ConfirmationDialogComponent} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import {UserComponent} from './component/user/user.component';
import {DetailUserComponent} from './component/user/detail-user/detail-user.component';
import { UserRoleComponent } from './component/user/user-role/user-role.component';
import {TreeviewModule} from 'ngx-treeview';
import { GroupUserComponent } from './component/group-user/group-user.component';
import { DetailGroupUserComponent } from './component/group-user/detail-group-user/detail-group-user.component';
import { GroupUserRoleComponent } from './component/group-user/group-user-role/group-user-role.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NZ_DATE_LOCALE, NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {vi} from 'date-fns/locale';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzButtonModule} from 'ng-zorro-antd/button';
import { AdmGrantGroupToUserComponent } from './component/adm-grant-group-to-user/adm-grant-group-to-user.component';
import { AdmGrantUserComponent } from './component/adm-grant-user/adm-grant-user.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTreeViewModule} from 'ng-zorro-antd/tree-view';
import {NzTransferModule} from 'ng-zorro-antd/transfer';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { AdmGroupUserSearchComponent } from './component/adm_group_user/adm-group-user-search/adm-group-user-search.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import { AdmGroupUserCreateComponent } from './component/adm_group_user/adm-group-user-create/adm-group-user-create.component';
import { AdmGrantGroupComponent } from './component/adm-grant-group/adm-grant-group.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import { InspectorSearchComponent } from './component/inspector/inspector-search/inspector-search.component';
import { InspectorEditComponent } from './component/inspector/inspector-edit/inspector-edit.component';
import { InspectorDetailComponent } from './component/inspector/inspector-detail/inspector-detail.component';
import { InspectorCreateComponent } from './component/inspector/inspector-create/inspector-create.component';
import { InspectorChangeComponent } from './component/inspector/inspector-change/inspector-change.component';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ReactiveFormsModule,
        UserRouting,
        CommonComponentsModule,
        TreeviewModule.forRoot(),
        NzSelectModule,
        NzSpinModule,
        NzAutocompleteModule,
        NzDatePickerModule,
        NzInputModule,
        NzFormModule,
        NzModalModule,
        NzButtonModule,
        NzIconModule,
        NzTreeViewModule,
        NzTransferModule,
        NzDropDownModule,
        NzTableModule,
        NzRadioModule,
        NzCheckboxModule
    ],
  entryComponents: [
    ConfirmationDialogComponent,
    UserRoleComponent,
    DetailUserComponent,
    GroupUserRoleComponent,
    DetailGroupUserComponent
  ],
  declarations: [
    UserComponent,
    DetailUserComponent,
    UserRoleComponent,
    GroupUserComponent,
    DetailGroupUserComponent,
    GroupUserRoleComponent,
    AdmGrantGroupToUserComponent,
    AdmGrantUserComponent,
    AdmGroupUserSearchComponent,
    AdmGroupUserCreateComponent,
    AdmGrantGroupComponent,
    InspectorSearchComponent,
    InspectorEditComponent,
    InspectorDetailComponent,
    InspectorCreateComponent,
    InspectorChangeComponent
  ],
  providers: [
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_DATE_LOCALE, useValue: vi}
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule {
}
