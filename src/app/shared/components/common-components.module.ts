import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ButtonComponent} from './button/button.component';
import {FormsModule} from '@angular/forms';
import {SpinnerComponent} from './spinner/spinner.component';
import {AlertComponent} from './alert/alert.component';
import {ControlMessagesComponent} from './control-mesages/control-messages.component';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {CommasFormatDirective} from './directives/commas-format.directive';
import {ProgressPercentComponent} from './progress-percent/progress-percent.component';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProgressbarModule.forRoot()
  ],
  declarations: [
    ButtonComponent,
    SpinnerComponent,
    AlertComponent,
    ControlMessagesComponent,
    ConfirmationDialogComponent,
    CommasFormatDirective,
    ProgressPercentComponent
  ],
  providers: [],
  exports: [
    ButtonComponent,
    SpinnerComponent,
    AlertComponent,
    ControlMessagesComponent,
    ConfirmationDialogComponent,
    CommasFormatDirective,
    ProgressPercentComponent
  ]
})
export class CommonComponentsModule {
}
