import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {IAlert, IAlertType} from './alert.model';

@Injectable({providedIn: 'root'})
export class AlertService {
  private subject = new Subject<IAlert>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  // enable subscribing to alerts observable
  onAlert(alertId?: string): Observable<IAlert> {
    return this.subject.asObservable().pipe(filter(x => x && x.alertId === alertId));
  }

  onAlertCleanAll(): Observable<IAlert> {
    return this.subject.asObservable();
  }

  // convenience methods
  success(message: string, alertId?: string) {
    this.alert(new IAlert({message, type: IAlertType.Success, alertId}));
  }

  error(message: string, alertId?: string) {
    this.alert(new IAlert({message, type: IAlertType.Error, alertId}));
  }

  info(message: string, alertId?: string) {
    this.alert(new IAlert({message, type: IAlertType.Info, alertId}));
  }

  warn(message: string, alertId?: string) {
    this.alert(new IAlert({message, type: IAlertType.Warning, alertId}));
  }

  // main alert method
  alert(alert: IAlert) {
    this.keepAfterRouteChange = alert.keepAfterRouteChange;
    this.subject.next(alert);
  }

  // clear alerts
  clear(alertId?: string) {
    this.subject.next(new IAlert({alertId}));
  }
}
