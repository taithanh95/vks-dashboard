// Angular
import {CommonModule, registerLocaleData} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// Dropdowns Component
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
// Components Routing
import {NgxPaginationModule} from 'ngx-pagination';
import {CommonComponentsModule} from '../shared/components/common-components.module';
import {ConfirmationDialogComponent} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import {SoThuLyRouting} from './so-thu-ly.routing';
import {TamGiamComponent} from './component/tam-giam-mau-so-hai-hai/tam-giam.component';
import {TiepNhanTinBaoMauSoBaComponent} from './component/tiep-nhan-tin-bao-mau-so-ba/tiep-nhan-tin-bao-mau-so-ba.component';
import {GiaiQuyetTinBaoMauSoBonComponent} from './component/giai-quyet-tin-bao-mau-so-bon/giai-quyet-tin-bao-mau-so-bon.component';
import {MauSoHaiComponent} from './component/mau-so-hai/mau-so-hai.component';
import {MauSoMotComponent} from './component/mau-so-mot/mau-so-mot.component';
import {MauSoMuoiHaiComponent} from './component/mau-so-muoi-hai/mau-so-muoi-hai.component';
import {MauSoSauComponent} from './component/mau-so-sau/mau-so-sau.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzResizableModule} from 'ng-zorro-antd/resizable';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import {NZ_ICONS, NzIconModule} from 'ng-zorro-antd/icon';
import {enUS} from 'date-fns/locale';
import {NZ_DATE_LOCALE, NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {IconDefinition} from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {MauSoHaiMotComponent} from './component/mau-so-hai-mot/mau-so-hai-mot.component';
import {MauSoMuoiBayComponent} from './component/mau-so-muoi-bay/mau-so-muoi-bay.component';
import {MauSoHaiBaComponent} from './component/mau-so-hai-ba/mau-so-hai-ba.component';
import {MauSoHaiTuComponent} from './component/mau-so-hai-tu/mau-so-hai-tu.component';
import {MauSoHaiNamComponent} from './component/mau-so-hai-nam/mau-so-hai-nam.component';
import {MauSoHaiSauComponent} from './component/mau-so-hai-sau/mau-so-hai-sau.component';
import {MauSoHaiBayComponent} from './component/mau-so-hai-bay/mau-so-hai-bay.component';
import {MauSoHaiTamComponent} from './component/mau-so-hai-tam/mau-so-hai-tam.component';
import {MauSoHaiChinComponent} from './component/mau-so-hai-chin/mau-so-hai-chin.component';
import {MauSoBaMuoiComponent} from './component/mau-so-ba-muoi/mau-so-ba-muoi.component';
import {MauSoNamComponent} from './component/mau-so-nam/mau-so-nam.component';
import {MauSoBayComponent} from './component/mau-so-bay/mau-so-bay.component';
import {MauSoMuoiMotComponent} from './component/mau-so-muoi-mot/mau-so-muoi-mot.component';
import {MauSoMuoiBonComponent} from './component/mau-so-muoi-bon/mau-so-muoi-bon.component';
import {MauSoBaHaiComponent} from './component/mau-so-ba-hai/mau-so-ba-hai.component';
import {MauSoBaMotComponent} from './component/mau-so-ba-mot/mau-so-ba-mot.component';
import {MauSoTamComponent} from './component/mau-so-tam/mau-so-tam.component';
import {MauSoChinComponent} from './component/mau-so-chin/mau-so-chin.component';
import {MauSoMuoiComponent} from './component/mau-so-muoi/mau-so-muoi.component';
import {MauSoMuoiNamComponent} from './component/mau-so-muoi-nam/mau-so-muoi-nam.component';
import {MauSoMuoiSauComponent} from './component/mau-so-muoi-sau/mau-so-muoi-sau.component';
import {MauSoMuoiTamComponent} from './component/mau-so-muoi-tam/mau-so-muoi-tam.component';
import {MauSoMuoiBaComponent} from './component/mau-so-muoi-ba/mau-so-muoi-ba.component';
import {MauSoBaBaComponent} from './component/mau-so-ba-ba/mau-so-ba-ba.component';
import {MauSoBaTuComponent} from './component/mau-so-ba-tu/mau-so-ba-tu.component';
import {MauSoBaNamComponent} from './component/mau-so-ba-nam/mau-so-ba-nam.component';
import {MauSoBaSauComponent} from './component/mau-so-ba-sau/mau-so-ba-sau.component';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import { SortDecisionPipe } from './pipes/sortDecision.pipe';
import { MauSoSauSauComponent } from './component/mau-so-sau-sau/mau-so-sau-sau.component';
import { MauSoMuoiChinComponent } from './component/mau-so-muoi-chin/mau-so-muoi-chin.component';
import { MauSoHaiMuoiComponent } from './component/mau-so-hai-muoi/mau-so-hai-muoi.component';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzButtonModule} from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzTabsModule} from 'ng-zorro-antd/tabs';


registerLocaleData(en);
registerLocaleData(vi);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        SoThuLyRouting,
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        NgbModule,
        NzTableModule,
        NzResizableModule,
        NzToolTipModule,
        NzSelectModule,
        NzSpinModule,
        NzEmptyModule,
        NzPipesModule,
        NzPaginationModule,
        NzDatePickerModule,
        NzIconModule,
        NzCollapseModule,
        NzButtonModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzTabsModule
    ],
  entryComponents: [
    ConfirmationDialogComponent,
    // DetailProvinceComponent,
    // DetailDistrictComponent,
    // DetailVillageComponent,
    // DetailBankComponent,
    // DetailEmailComponent,
    // DetailSupplierComponent,
    // DetailParamComponent,
    // DetailPositionComponent,
    // DetailEvnPcComponent
  ],
  providers: [
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_ICONS, useValue: icons},
    {provide: NZ_DATE_LOCALE, useValue: enUS}
  ],
  declarations: [
    TamGiamComponent,
    TiepNhanTinBaoMauSoBaComponent,
    GiaiQuyetTinBaoMauSoBonComponent,
    MauSoHaiComponent,
    MauSoMotComponent,
    MauSoMuoiHaiComponent,
    MauSoSauComponent,
    MauSoHaiMotComponent,
    MauSoMuoiBayComponent,
    MauSoHaiBaComponent,
    MauSoHaiTuComponent,
    MauSoHaiNamComponent,
    MauSoHaiSauComponent,
    MauSoHaiBayComponent,
    MauSoHaiTamComponent,
    MauSoHaiChinComponent,
    MauSoBaMuoiComponent,
    MauSoNamComponent,
    MauSoBayComponent,
    MauSoMuoiMotComponent,
    MauSoMuoiBonComponent,
    MauSoBaHaiComponent,
    MauSoBaMotComponent,
    MauSoTamComponent,
    MauSoChinComponent,
    MauSoMuoiComponent,
    MauSoMuoiNamComponent,
    MauSoMuoiSauComponent,
    MauSoMuoiTamComponent,
    MauSoMuoiBaComponent,
    MauSoBaBaComponent,
    MauSoBaTuComponent,
    MauSoBaNamComponent,
    MauSoBaSauComponent,
    MauSoSauSauComponent,
    SortDecisionPipe,
    MauSoMuoiChinComponent,
    MauSoHaiMuoiComponent,
    // DistrictComponent,
    // CommuneComponent,
    // VillageComponent,
    // DetailProvinceComponent,
    // DetailDistrictComponent,
    // DetailCommuneComponent,
    // DetailVillageComponent,
    // BankComponent,
    // DetailBankComponent,
    // EmailComponent,
    // DetailEmailComponent,
    // SupplierComponent,
    // DetailSupplierComponent,
    // ImportAreaComponent,
    // PositionComponent,
    // DetailPositionComponent,
    // EvnPcComponent,
    // DetailEvnPcComponent
  ]
})
export class SoThuLyModule {
}
