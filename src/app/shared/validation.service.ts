import {Injectable} from '@angular/core';

@Injectable()
export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Giá trị bắt buộc nhập',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPhone': 'Invalid phone number',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Độ dài tối thiểu ${validatorValue.requiredLength} ký tự`,
      'maxlength': `Độ dài tối đa ${validatorValue.requiredLength} ký tự`,
      'invalidNumber': 'Không phải giá trị số',
      'invalidMultipleNumber': 'Dữ liệu phải là số cách nhau dấu ;',
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control && control.value && control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return {'invalidCreditCard': true};
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control && control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {'invalidEmailAddress': true};
    }
  }

  static emailMultipleValidator(control) {
    // RFC 2822 compliant regex
    if (control && control.value) {
      const result = control.value.trim().split(/;/);
      for (let i = 0; i < result.length; i++) {
        if (!result[i].match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
          return {'invalidEmailAddress': true};
        }
      }
      return null;
    } else {
      return {'invalidEmailAddress': true};
    }
  }


  static phoneValidator(control) {
    if (control && control.value && control.value.match(/^[0-9]+$/)) {
      return null;
    } else {
      return {'invalidPhone': true};
    }
  }

  static phoneMultipleValidator(control) {
    if (control && control.value) {
      const result = control.value.replace(/\s/g, '').split(/;/);
      for (let i = 0; i < result.length; i++) {
        if (!result[i].match(/^[0-9]+$/)) {
          return {'invalidPhone': true};
        }
      }
      return null;
    } else {
      return {'invalidPhone': true};
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control && control.value && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }

  static numberValidator(control) {
    // no require
    if (control == null || control.value == null || control.value === '') {
      return null;
    }
    if (control && control.value && control.value.toString().match(/^[0-9]*$/)) {
      return null;
    } else {
      return {'invalidNumber': true};
    }
  }

  static multipleNumberValidator(control) {
    if (control && control.value) {
      const result = control.value.replace(/\s/g, '').split(/;/);
      for (let i = 0; i < result.length; i++) {
        if (!result[i].match(/^[0-9]*$/)) {
          return {'invalidMultipleNumber': true};
        }
      }
      return null;
    } else {
      return {'invalidMultipleNumber': true};
    }
  }

  /**
   * long number: 123.00, 123, 123.1
   */
  static longNumberValidator(control) {
    // no require
    if (control == null || control.value == null || control.value === '') {
      return null;
    }
    if (control && control.value && control.value.toString().match(/^\d*\.?\d{0,2}$/)) {
      return null;
    } else {
      return {'invalidNumber': true};
    }
    return null;
  }
}
