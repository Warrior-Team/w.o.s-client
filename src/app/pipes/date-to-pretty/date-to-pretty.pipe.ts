import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'dateToPretty'})
export class DateToPrettyPipe implements PipeTransform {

  transform(date: string): string {
    const momentDate = moment(date, 'HH:mm:ss DD/MM/YYYY').fromNow();
    return momentDate;
  }
}
