import {Directive, DoCheck, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[commas-format]'
})
export class CommasFormatDirective implements OnInit, DoCheck {
  @Input() commaFirst: boolean = false;

  private el: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.el.value = this.el.value.replaceAll(',', '');
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string | number) {
    if (!this.el.value) {
      return;
    }
    /*if (this.commaFirst) {
      this.el.value = parseInt(this.el.value).toString()
    }*/
    if (this.el.value && this.el.value.trim() === 'NaN') {
      this.el.value = '';
    } else {
      if (this.el.value && this.el.value.trim().length > 0) {
        this.el.value = this.numberWithCommas(this.el.value);
      }
    }
    this.el.dispatchEvent(new Event('input'));
  }

  numberWithCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join(',');
  }
}
