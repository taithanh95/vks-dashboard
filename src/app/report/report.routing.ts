import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RequestReportComponent} from './components/request-report/request-report.component';
import {ReportPeriodComponent} from './components/report-period/report-period.component';


const routes: Routes = [
  {
    path: '',
    // component: RequestReportComponent,
    // canActivate: [AuthGuard]
    children: [
      // {
      //   path: '',
      //   redirectTo: 'bao-cao',
      //   pathMatch: 'full'
      // },
      {
        path: 'request-report',
        component: RequestReportComponent,
        data: {
          title: 'Yêu cầu báo cáo'
        }
      },
      {
        path: 'report-period',
        component: ReportPeriodComponent,
        data: {
          title: 'Báo cáo kỳ'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRouting { }
