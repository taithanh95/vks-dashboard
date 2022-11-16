import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationService} from '../../validation.service';

@Component({
  selector: 'control-messages',
  template: `<label *ngIf="errorMessage !== null" class="error">{{errorMessage}}</label>`
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() submited: boolean;

  constructor() {
  }

  get errorMessage() {
    if (this.control && this.control.errors) {
      if (this.submited === undefined || this.submited === null) {
        for (const propertyName in this.control.errors) {
          if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
            return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
          }
        }
      } else {
        for (const propertyName in this.control.errors) {
          if (this.control.errors.hasOwnProperty(propertyName) && (this.submited || this.control.touched)) {
            return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
          }
        }
      }
    }
    return null;
  }
}
