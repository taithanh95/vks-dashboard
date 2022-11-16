// Angular
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
// Dropdowns Component
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
// Components Routing
import {CategoryRouting} from './category.routing';
import {NgxPaginationModule} from 'ngx-pagination';
import {CommonComponentsModule} from '../shared/components/common-components.module';
import {ConfirmationDialogComponent} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import {ParamComponent} from './component/param/param.component';
import {ProvinceComponent} from './component/province/province.component';
import {DistrictComponent} from './component/district/district.component';
import {CommuneComponent} from './component/commune/commune.component';
import {VillageComponent} from './component/village/village.component';
import {DetailProvinceComponent} from './component/province/detail-province/detail-province.component';
import {DetailDistrictComponent} from './component/district/detail-district/detail-district.component';
import {DetailCommuneComponent} from './component/commune/detail-commune/detail-commune.component';
import {DetailVillageComponent} from './component/village/detail-village/detail-village.component';
import {BankComponent} from './component/bank/bank.component';
import {DetailBankComponent} from './component/bank/detail-bank/detail-bank.component';
import {EmailComponent} from './component/email/email.component';
import {DetailEmailComponent} from './component/email/detail-email/detail-email.component';
import {SupplierComponent} from './component/supplier/supplier.component';
import {DetailSupplierComponent} from './component/supplier/detail-supplier/detail-supplier.component';
import {ImportAreaComponent} from './component/import-area/import-area.component';
import {DetailParamComponent} from './component/param/detail-param/detail-param.component';
import {PositionComponent} from './component/position/position.component';
import {DetailPositionComponent} from './component/position/detail-position/detail-position.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CategoryRouting,
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    DetailCommuneComponent,
    DetailProvinceComponent,
    DetailDistrictComponent,
    DetailVillageComponent,
    DetailBankComponent,
    DetailEmailComponent,
    DetailSupplierComponent,
    DetailParamComponent,
    DetailPositionComponent
  ],
  declarations: [
    ParamComponent,
    ProvinceComponent,
    DistrictComponent,
    CommuneComponent,
    VillageComponent,
    DetailProvinceComponent,
    DetailDistrictComponent,
    DetailCommuneComponent,
    DetailVillageComponent,
    BankComponent,
    DetailBankComponent,
    EmailComponent,
    DetailEmailComponent,
    SupplierComponent,
    DetailSupplierComponent,
    ImportAreaComponent,
    DetailParamComponent,
    PositionComponent,
    DetailPositionComponent
  ]
})
export class CategoryModule {
}
