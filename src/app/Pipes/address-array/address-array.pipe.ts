import { Pipe, PipeTransform } from '@angular/core';
import {hadithaddress } from "../../interfaces";
@Pipe({
  name: 'addressArray'
})
export class AddressArrayPipe implements PipeTransform {

  transform(hadithaddress: hadithaddress, args?: any) {
    let res=[];
    if(hadithaddress==null)return;
    let start=hadithaddress.from;
    for (let index = 0; index <= (hadithaddress.to-hadithaddress.from); index++) {
      res.push(start)
      start++;
    }

    return res
  }

}
