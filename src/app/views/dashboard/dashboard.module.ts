import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule, DatePipe} from '@angular/common';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {CommonComponentsModule} from '../../shared/components/common-components.module';
import {ParsePipe} from 'ngx-moment';
import {NzGridModule} from 'ng-zorro-antd/grid';

@NgModule({
    imports: [
        FormsModule,
        DashboardRoutingModule,
        ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        CommonModule,
        NzSelectModule,
        NzSpinModule,
        CommonComponentsModule,
        NzGridModule,
    ],
  declarations: [DashboardComponent], providers: [
    ParsePipe,
    DatePipe
  ]
})
export class DashboardModule {
}
