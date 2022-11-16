import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChartJSComponent} from './chartjs.component';

const routes: Routes = [
  {
    path: '',
    component: ChartJSComponent,
    data: {
      title: 'Charts'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartJSRoutingModule {
}
