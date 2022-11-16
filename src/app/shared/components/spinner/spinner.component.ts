import {Component, Input, ViewEncapsulation} from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'c-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpinnerComponent {
  @Input()
  fullScreen = false;

  @Input()
  show = false;

  @Input()
  size = 'md';

  @Input()
  loadingText = 'Đang thực hiện...';

  duration = interval(1000);
}
