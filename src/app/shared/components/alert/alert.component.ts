import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {IAlert, IAlertType} from './alert.model';
import {AlertService} from './alert.service';

@Component({selector: 'alert', templateUrl: 'alert.component.html'})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() autoCloseDelay: number = 4000;
  @Input() autoClose: boolean = false;
  @Input() noMargin: boolean = false;

  alerts: IAlert[] = [];
  subscription: Subscription;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        this.alerts = [];
        if (!alert.message) {
          // clear alerts when an empty alert is received
          return;
        }
        // add alert to array
        this.alerts.push(alert);
        if (this.autoClose) {
          var self = this;
          const timeout = this.autoCloseDelay > 0 ? this.autoCloseDelay : 4000;
          window.setTimeout(function () {
            self.removeAlert(alert);
            return;
          }, timeout);
        }
      });

    this.subscription = this.alertService.onAlertCleanAll()
      .subscribe(alert => {
        if (!alert.alertId && !alert.message) {
          this.alerts = [];
          return;
        }
      });


  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }

  removeAlert(alert: IAlert) {
    // remove specified alert from array
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: IAlert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case IAlertType.Success:
        return 'alert alert-success';
      case IAlertType.Error:
        return 'alert alert-danger';
      case IAlertType.Info:
        return 'alert alert-info';
      case IAlertType.Warning:
        return 'alert alert-warning';
    }
  }
}
