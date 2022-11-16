import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

// Dropdowns Component
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
// Routing
import {RoleRouting} from './role.routing';

// Components Routing
import {NgxPaginationModule} from 'ngx-pagination';
import {CommonComponentsModule} from '../shared/components/common-components.module';
import {ConfirmationDialogComponent} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import {RoleComponent} from './component/role/role.component';
import {GroupRoleComponent} from './component/group-role/group-role.component';
import {DetailGroupRoleComponent} from './component/group-role/detail-group-role/detail-group-role.component';
import {DetailRoleComponent} from './component/role/detail-role/detail-role.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    ReactiveFormsModule,
    RoleRouting,
    CommonComponentsModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    DetailGroupRoleComponent,
    DetailRoleComponent
  ],
  declarations: [
    RoleComponent,
    GroupRoleComponent,
    DetailGroupRoleComponent,
    DetailRoleComponent
  ],
  exports: [RouterModule]
})
export class RoleModule {
}
