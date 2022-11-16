export class IAlert {
  type: IAlertType;
  message: string;
  alertId: string;
  keepAfterRouteChange: boolean;

  constructor(init?: Partial<IAlert>) {
    Object.assign(this, init);
  }
}

export enum IAlertType {
  Success,
  Error,
  Info,
  Warning
}
