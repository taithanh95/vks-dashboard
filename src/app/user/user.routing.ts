import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserComponent} from './component/user/user.component';
import {GroupUserComponent} from './component/group-user/group-user.component';
import {AdmGrantGroupToUserComponent} from './component/adm-grant-group-to-user/adm-grant-group-to-user.component';
import {AdmGrantUserComponent} from './component/adm-grant-user/adm-grant-user.component';
import {AdmGroupUserSearchComponent} from './component/adm_group_user/adm-group-user-search/adm-group-user-search.component';
import {AdmGrantGroupComponent} from './component/adm-grant-group/adm-grant-group.component';
import { InspectorSearchComponent } from './component/inspector/inspector-search/inspector-search.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý tài khoản'
    },
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: UserComponent,
        data: {
          title: 'Danh sách tài khoản'
        }
      },
      {
        path: 'group-user',
        component: GroupUserComponent,
        data: {
          title: 'Nhóm người dùng báo cáo'
        }
      },
      {
        path: 'grant-group-to-user',
        component:AdmGrantGroupToUserComponent,
        data: {
          title: 'Phân quyền cho nhóm nghiệp vụ'
        }
      },
      {
        path: 'grant-to-user',
        component:AdmGrantUserComponent,
        data: {
          title: 'Phân quyền nghiệp vụ'
        }
      },
      {
        path: 'adm-group-user',
        component:AdmGroupUserSearchComponent,
        data: {
          title: 'Nhóm người dùng nghiệp vụ'           
        }
      },
      {
        path: 'grant-to-group',
        component:AdmGrantGroupComponent,
        data: {
          title: 'Phân quyền cho nhóm người dùng nghiệp vụ'
        }
      },
      {
        path: 'inspertor',
        component:InspectorSearchComponent,
        data: {
          title: 'Người xử lý'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRouting {
}
