import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ReportRouting} from './report.routing';
import {RequestReportComponent} from './components/request-report/request-report.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {CommonComponentsModule} from '../shared/components/common-components.module';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzTransferModule} from 'ng-zorro-antd/transfer';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzFormModule} from 'ng-zorro-antd/form';
import {CreateRequestReportComponent} from './components/request-report/create-request-report/create-request-report.component';
import {UpdateRequestReportComponent} from './components/request-report/update-request-report/update-request-report.component';
import {DetailRequestReportComponent} from './components/request-report/detail-request-report/detail-request-report.component';
import {TreeviewModule} from 'ngx-treeview';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {DateService} from '../common/util/date.service';
import {ReportStatusPipe} from './pipes/report-status.pipe';
import {ReportCodeDescriptionPipe} from './pipes/report-code-description.pipe';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import { UpdateReportComponent } from './components/request-report/update-report/update-report.component';
import { Report01Component } from './components/request-report/update-report/report01/report01.component';
import { Report07Component } from './components/request-report/update-report/report07/report07.component';
import { Report08Component } from './components/request-report/update-report/report08/report08.component';
import { Report09Component } from './components/request-report/update-report/report09/report09.component';
import { Report33Component } from './components/request-report/update-report/report33/report33.component';
import { Report02Component } from './components/request-report/update-report/report02/report02/report02.component';
import { Report03Component } from './components/request-report/update-report/report03/report03.component';
import { Report05Component } from './components/request-report/update-report/report05/report05.component';
import { Report06Component } from './components/request-report/update-report/report06/report06.component';
import { Report12Component } from './components/request-report/update-report/report12/report12.component';
import { Report11Component } from './components/request-report/update-report/report11/report11.component';
import { Report04Component } from './components/request-report/update-report/report04/report04.component';
import { Report10Component } from './components/request-report/update-report/report10/report10.component';
import { ReportPeriodComponent } from './components/report-period/report-period.component';
import { CreateReportPeriodComponent } from './components/report-period/create-report-period/create-report-period.component';
import { DetailReportPeriodComponent } from './components/report-period/detail-report-period/detail-report-period.component';
import { UpdateReportPeriodComponent } from './components/report-period/update-report-period/update-report-period.component';
import { EditReportComponent } from './components/report-period/edit-report/edit-report.component';
import { Reportperiod02Component } from './components/report-period/edit-report/reportperiod02/reportperiod02.component';
@NgModule({
  declarations: [
    RequestReportComponent,
    CreateRequestReportComponent,
    UpdateRequestReportComponent,
    DetailRequestReportComponent,
    ReportStatusPipe,
    ReportCodeDescriptionPipe,
    UpdateReportComponent,
    Report01Component,
    Report07Component,
    Report08Component,
    Report09Component,
    Report33Component,
    Report02Component,
    Report03Component,
    Report05Component,
    Report06Component,
    Report12Component,
    Report11Component,
    Report04Component,
    Report10Component,
    ReportPeriodComponent,
    CreateReportPeriodComponent,
    DetailReportPeriodComponent,
    UpdateReportPeriodComponent,
    EditReportComponent,
    Reportperiod02Component
  ],
    imports: [
        CommonModule,
        ReportRouting,
        NzSpinModule,
        CommonComponentsModule,
        NzTableModule,
        NzToolTipModule,
        NgxPaginationModule,
        FormsModule,
        NzSelectModule,
        NzDatePickerModule,
        ReactiveFormsModule,
        NzDividerModule,
        NzTransferModule,
        NzTreeModule,
        NzButtonModule,
        NzPageHeaderModule,
        NzIconModule,
        NzFormModule,
        TreeviewModule,
        NzModalModule,
        NzPaginationModule
    ],
  entryComponents: [
    CreateRequestReportComponent,
    DetailRequestReportComponent,
    UpdateRequestReportComponent,
    UpdateReportComponent,
    CreateReportPeriodComponent,
    DetailReportPeriodComponent,
    UpdateReportPeriodComponent,
    EditReportComponent,
  ],
  providers: [DatePipe, DateService]
})
export class ReportModule {
}
