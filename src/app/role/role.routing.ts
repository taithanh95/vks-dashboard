import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RoleComponent} from './component/role/role.component';
import {GroupRoleComponent} from './component/group-role/group-role.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý chức năng'
    },
    children: [
      {
        path: '',
        redirectTo: 'role',
        pathMatch: 'full'
      },
      {
        path: 'list-role',
        component: RoleComponent,
        data: {
          title: 'Danh sách chức năng'
        }
      },
      {
        path: 'list-group-role',
        component: GroupRoleComponent,
        data: {
          title: 'Danh sách nhóm chức năng'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRouting {
}
