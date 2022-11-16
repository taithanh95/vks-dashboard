import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {GopYComponent} from './gop-y.component';
import {CommonModule, DatePipe} from '@angular/common';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzResizableModule} from 'ng-zorro-antd/resizable';
import {NzEmptyModule} from 'ng-zorro-antd/empty';



import {GopYRoutingModule} from './gop-y.routing.module';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzFormModule} from 'ng-zorro-antd/form';
import {CreateGopYComponent} from './create-gop-y/create-gop-y.component';
import {TreeviewModule} from 'ngx-treeview';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {EditGopYComponent} from './edit-gop-y/edit-gop-y.component';
import {CommentGopYComponent} from './comment-gop-y/comment-gop-y.component';
import {CommonComponentsModule} from '../../shared/components/common-components.module';
import {DateService} from '../../common/util/date.service';
import {UpdateApproveGopYComponent} from './update-approve-gop-y/update-approve-gop-y.component';
import {NzTabsModule} from 'ng-zorro-antd/tabs';

@NgModule({
  imports: [
    FormsModule,
    GopYRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    NzSelectModule,
    NzSpinModule,
    NzTableModule,
    NzToolTipModule,
    NzResizableModule,
    NzEmptyModule,
    NzSpinModule,
    NzEmptyModule,
    NzPipesModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzFormModule,
    TreeviewModule,
    NzModalModule,
    NzPaginationModule,
    CommonComponentsModule,
    NzTabsModule
  ],
  declarations: [GopYComponent, CreateGopYComponent, EditGopYComponent, CommentGopYComponent, UpdateApproveGopYComponent],
  entryComponents: [
    CreateGopYComponent, EditGopYComponent, CommentGopYComponent, UpdateApproveGopYComponent
  ],
  providers: [DatePipe, DateService]
})
export class GopYModule {
}
