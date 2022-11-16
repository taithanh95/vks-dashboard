import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-progress-percent',
  templateUrl: './progress-percent.component.html',
  styleUrls: ['./progress-percent.component.css']
})
export class ProgressPercentComponent implements OnInit {

  @Input()
  completed = 0;
  @Input()
  total = 0;

  dynamic: number;
  type: string;

  @ViewChild('bar') bar: ElementRef;

  get progressPercentage() {
    const value = Math.floor((this.completed / this.total) * 100);
    let type: string;

    if (value < 25) {
      type = 'danger';
    } else if (value < 50) {
      type = 'warning';
    } else if (value < 75) {
      type = 'info';
    } else {
      type = 'success';
    }

    this.dynamic = value;
    this.type = type;
    return this.dynamic;
  }

  ngOnInit() {
  }

}
