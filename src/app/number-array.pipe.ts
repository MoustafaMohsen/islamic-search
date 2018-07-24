import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberArray'
})
export class NumberArrayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let res=[];
    for (let i = 0; i < value; i++) {
          res.push(i)
    }
    return res;
  }

}
