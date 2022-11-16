import {Component, EventEmitter, Input, Output, ViewEncapsulation,} from '@angular/core';

@Component({
  selector: 'c-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() label: string;
  @Output() onClick = new EventEmitter<any>();
  @Input() type: string = 'button';
  @Input() id: string = '';
  @Input() className: string = '';
  @Input() iconClassName: string = '';
  @Input() loading: boolean = false;

  constructor() {
  }

  onClickButton(event) {
    this.onClick.emit(event);
  }
}
