import { Injectable } from '@angular/core';
import { WebService } from '../web/web.service';
import { Lib3 } from 'src/app/interfaces';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  ArContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];
  EnContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];

  constructor(private web:WebService,private snack: MatSnackBar) {
    
    this.web.IncomingRequests$.subscribe(
      request => {
        //===If Hadith
        if (request.source == "hadith") {
          //Loading
          this.web.Loading.next(true);
          if(request.Method==6)
          {
            console.log("Method 6 request");
            
            this.web.getManyBlocks(request).subscribe(
              blocks => {
                console.log(blocks);
                this.ArContentAndRedArray = [{ refrence: null, content: null }];
                this.EnContentAndRedArray = [{ refrence: null, content: null }];
                let arC: Lib3.Value[];
                let enC: Lib3.Value[];
                for (let i = 0; i < blocks.length; i++) {
                  const b = blocks[i];
                  arC = b.content
                    .filter(c => c.name.match(/ar/g))
                    .map(x => {
                      let v: Lib3.Value = {
                        name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                        value: x.value,
                        id: x.id
                      };
                      return v;
                    })
                    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                  enC = b.content
                    .filter(c => c.name.match(/en/g))
                    .map(x => {
                      let v: Lib3.Value = {
                        name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                        value: x.value,
                        id: x.id
                      };
                      return v;
                    })
                    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                  this.ArContentAndRedArray.push({
                    content: arC.slice(),
                    refrence: b.refrences.slice()
                  });
  
                  this.EnContentAndRedArray.push({
                    content: enC.slice(),
                    refrence: b.refrences.slice()
                  });
                } //for
                if (this.ArContentAndRedArray.length > 1)
                  this.ArContentAndRedArray.shift();
  
                if (this.EnContentAndRedArray.length > 1)
                  this.EnContentAndRedArray.shift();
  
                this.web.Loading.next(false);
              },
  
              error => {
                this.snack.open(" " + request.url + " Not found", "X", {
                  duration: 3000
                });
                this.web.Loading.next(false);
              }
            );
          }
  
          //if Single Content
          if (request.Method != 5 && request.Method != 6)
            this.web.getHadithBlock(request).subscribe(
              block => {
                this.ArContentAndRedArray = [{ refrence: null, content: null }];
                this.EnContentAndRedArray = [{ refrence: null, content: null }];
                let arC: Lib3.Value[] = block.content
                  .filter(c => c.name.match(/ar/g))
                  .map(x => {
                    let v: Lib3.Value = {
                      name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                      value: x.value,
                      id: x.id
                    };
  
                    return v;
                  })
                  .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                let enC: Lib3.Value[] = block.content
                  .filter(c => c.name.match(/en/g))
                  .map(x => {
                    let v: Lib3.Value = {
                      name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                      value: x.value,
                      id: x.id
                    };
                    return v;
                  })
                  .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                this.ArContentAndRedArray[0].content = arC.slice();
                this.ArContentAndRedArray[0].refrence = block.refrences.slice();
  
                this.EnContentAndRedArray[0].content = enC.slice();
                this.EnContentAndRedArray[0].refrence = block.refrences.slice();
  
                this.web.Loading.next(false);
              },
  
              error => {
                this.snack.open(" " + request.url + " Not found", "X", {
                  duration: 5000
                });
                this.web.Loading.next(false);
              }
            );
          //if Array Content
          if (request.Method == 5) {
            this.web.getHadithBlockArray(request).subscribe(
              blocks => {
                console.log(blocks);
  
                this.ArContentAndRedArray = [{ refrence: null, content: null }];
  
                this.EnContentAndRedArray = [{ refrence: null, content: null }];
  
                let arC: Lib3.Value[];
                let enC: Lib3.Value[];
                for (let i = 0; i < blocks.length; i++) {
                  const b = blocks[i];
                  arC = b.content
                    .filter(c => c.name.match(/ar/g))
                    .map(x => {
                      let v: Lib3.Value = {
                        name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                        value: x.value,
                        id: x.id
                      };
                      return v;
                    })
                    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                  enC = b.content
                    .filter(c => c.name.match(/en/g))
                    .map(x => {
                      let v: Lib3.Value = {
                        name: x.name.replace(/([a-z|A-Z]+):/g, ""),
                        value: x.value,
                        id: x.id
                      };
                      return v;
                    })
                    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
                  this.ArContentAndRedArray.push({
                    content: arC.slice(),
                    refrence: b.refrences.slice()
                  });
  
                  this.EnContentAndRedArray.push({
                    content: enC.slice(),
                    refrence: b.refrences.slice()
                  });
                } //for
                if (this.ArContentAndRedArray.length > 1)
                  this.ArContentAndRedArray.shift();
  
                if (this.EnContentAndRedArray.length > 1)
                  this.EnContentAndRedArray.shift();
  
                this.web.Loading.next(false);
              },
  
              error => {
                this.snack.open(" " + request.url + " Not found", "X", {
                  duration: 3000
                });
                this.web.Loading.next(false);
              }
            );
          }
        } //If Hadith
  
        //===If Quran
        if (request.source == "quran") {
          //Loading
          this.web.Loading.next(true);
  
          //For arabic
  
          let _url;
          _url = `https://api.alquran.cloud/ayah/${request.value1}:${
            request.value2
          }/`;
  
          this.web.getQuran(_url + "ar" + ".asad").subscribe(
            ayat => {
              this.ArContentAndRedArray = [{ refrence: null, content: null }];
  
              this.ArContentAndRedArray[0] = {
                content: [{ value: ayat.data.text }],
                refrence: [
                  {
                    name: "Surah, Ayat",
                    value1: ayat.data.surah.number,
                    value2: ayat.data.numberInSurah
                  }
                ]
              };
  
              //remove the start of the first ayat
              if (request.value2 == 1 && request.value1 != 1) {
                let firstAyat: string = String(ayat.data.text);
                firstAyat = firstAyat.replace(
                  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ",
                  ""
                );
                this.ArContentAndRedArray[0].content = [{ value: firstAyat }];
              }
              this.web.Loading.next(false);
            },
  
            error => {
              this.snack.open(" " + request.url + " Not found", "X", {
                duration: 3000
              });
              this.web.Loading.next(false);
            }
          );
  
          //For English
          this.web.getQuran(_url + "en" + ".asad").subscribe(
            ayat => {
              this.EnContentAndRedArray = [{ refrence: null, content: null }];
              this.EnContentAndRedArray[0] = {
                content: [{ value: ayat.data.text }],
                refrence: [
                  {
                    name: "Surah, Ayat",
                    value1: ayat.data.surah.number,
                    value2: ayat.data.numberInSurah
                  }
                ]
              };
              //remove the start of the first ayat
              /*
              if(request.value2==1&&request.value1!=1){
                let firstAyat:string= String(ayat.data.text);
                firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','');
                this.EnContentArray=[[{value:firstAyat}]]
              }*/
              this.web.Loading.next(false);
            },
  
            error => {
              this.snack.open(" " + request.url + " Not found", "X", {
                duration: 3000
              });
              this.web.Loading.next(false);
            }
          );
        } //If Quran
  
        //If Requesting Array Content
      } //(request)
    ); //IncomingRequests$ subscribe

   }//constructor
  




}//class