import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ParamComponent} from './component/param/param.component';
import {ProvinceComponent} from './component/province/province.component';
import {DistrictComponent} from './component/district/district.component';
import {CommuneComponent} from './component/commune/commune.component';
import {VillageComponent} from './component/village/village.component';
import {BankComponent} from './component/bank/bank.component';
import {EmailComponent} from './component/email/email.component';
import {SupplierComponent} from './component/supplier/supplier.component';
import {ImportAreaComponent} from './component/import-area/import-area.component';
import {PositionComponent} from './component/position/position.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Danh mục'
    },
    children: [
      {
        path: '',
        redirectTo: 'category',
        pathMatch: 'full'
      },
      {
        path: 'param',
        component: ParamComponent,
        data: {
          title: 'Tham số hệ thống'
        }
      },
      {
        path: 'province',
        component: ProvinceComponent,
        data: {
          title: 'Tỉnh/Thành phố'
        }
      },
      {
        path: 'district',
        component: DistrictComponent,
        data: {
          title: 'Quận huyện'
        }
      },
      {
        path: 'commune',
        component: CommuneComponent,
        data: {
          title: 'Phường xã'
        }
      },
      {
        path: 'village',
        component: VillageComponent,
        data: {
          title: 'Thôn xóm tổ dân phố'
        }
      },
      {
        path: 'import-area',
        component: ImportAreaComponent,
        data: {
          title: 'Nhập địa bàn'
        }
      },
      {
        path: 'bank',
        component: BankComponent,
        data: {
          title: 'Ngân hàng'
        }
      },
      {
        path: 'email',
        component: EmailComponent,
        data: {
          title: 'Danh sách email'
        }
      },
      {
        path: 'supplier',
        component: SupplierComponent,
        data: {
          title: 'Nhà cung cấp'
        }
      },
      {
        path: 'position',
        component: PositionComponent,
        data: {
          title: 'Loại tài khoản'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRouting {
}
