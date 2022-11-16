import {Injectable} from '@angular/core';
import {formatDate} from '@angular/common';
import * as moment from 'moment';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class DateService {
  constructor(
    private toastrService: ToastrService
  ) {
  }
  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.error('Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringendAtWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.error('Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }
  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringendAtWithFormat(date, 'dd/MM/yyyy');
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }
  convertTimeToEndingOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(23, 59, 59, 0);
    } else {
      date = this.stringendAtWithFormat(date, 'dd/MM/yyyy');
      date.setHours(23, 59, 59, 0);
    }
    return date;
  }
  stringendAtWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }
  convertDateToStringByPattern(value: any, patten: string) {
    return formatDate(value, patten, 'en-GB');
  }

  getFirstDayOfMonth() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    firstDay.setHours(0, 0, 0, 0);
    return firstDay;
  }

  getFirstDayOfYear() {
    const date = new Date();
    const y = date.getFullYear();
    const firstDay = new Date(y, 0, 1);
    return firstDay;
  }

  getFirstDayOfYearVKS() {
    const date = new Date();
    const y = date.getFullYear();
    const firstDay = new Date(y, -1, 1);
    return firstDay;
  }

  getCurrentDate() {
    return new Date();
  }

  getFirstDayOfMonthInString(patten: string) {
    return (moment(this.getFirstDayOfMonth())).format(patten);
  }

  getCurrentDateInString(patten: string) {
    return (moment(this.getCurrentDate())).format(patten);
  }

  dateToString(date: Date, dateFormat: string) {
    return (moment(date)).format(dateFormat);
  }

  stringToDateWithFormat(value: string | Date, format: string): Date {
    return moment(value, format).toDate();
  }

  stringToDate(value: string): Date {
    if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
      throw new Error('Sai định dạng ngày tháng dd/MM/yyyy.');
    }
    const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
    if (isNaN(date.getTime())) {
      throw new Error('Ngày tháng không hợp lệ.');
    } else {
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      return date;
    }
  }

  getBeginningOfDay(date: Date): Date {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  getEndOfDay(date: Date): Date {
    if (date) {
      date.setHours(23, 59, 59, 999 );
    }
    return date;
  }
}

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }

  formatToString(date: NgbDateStruct | null): string {
    let day = '';
    let month = '';
    if (date.day < 10) {
      day = '0' + date.day;
    } else {
      day = date.day + '';
    }
    if (date.month < 10) {
      month = '0' + date.month;
    } else {
      month = date.month + '';
    }
    return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
  }

  ngbDateStructToDate(date: NgbDateStruct | null): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }



}
