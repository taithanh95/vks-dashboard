import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GopYComponent} from './gop-y.component';
import {CreateGopYComponent} from './create-gop-y/create-gop-y.component';
import {EditGopYComponent} from './edit-gop-y/edit-gop-y.component';
import {UpdateApproveGopYComponent} from './update-approve-gop-y/update-approve-gop-y.component';

const routes: Routes = [
  {
    path: '',
    component: GopYComponent,
    data: {
      title: 'Góp ý'
    }
  },
  {
    path:'',
    component: CreateGopYComponent,
    data: {
      title: ''
    }
  },
  {
    path:'',
    component: EditGopYComponent,
    data: {
      title: ''
    }
  },
  {
    path:'',
    component: UpdateApproveGopYComponent,
    data: {
      title: ''
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GopYRoutingModule {
}
