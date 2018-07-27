import {  Component,  OnInit} from '@angular/core';
import {  WebService} from '../web.service';
import {  MatSnackBar} from '@angular/material';
import {  FormControl,  Validators,  FormBuilder,  FormGroup, ValidationErrors} from '@angular/forms';
import {  HttpClient} from "@angular/common/http";
import {  map,  filter,  pluck} from "rxjs/operators";
import {  ApiRequest,  hadithaddress} from "../interfaces";
import {  Bukhari} from "../SourceOptions/Bukhari";
import {  Muslim} from "../SourceOptions/Muslim";
import {  QuranIndex} from '../SourceOptions/Quran';
declare var $: any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit {
  constructor(private web: WebService, private snack: MatSnackBar, private FormBuilder: FormBuilder) {
    this.rFH = FormBuilder.group({
      'hadith_number': [null, Validators.required],
      'hadith_chapter': [null, Validators.required],
      'hadith_number_options': [null, Validators.required],
      'hadith_chapter_options': [null]
    });

    this.rFQ=FormBuilder.group({
      'surah_number': [1, Validators.compose([Validators.required, Validators.max(114), Validators.min(1)])],
      'ayat_number': [1, Validators.compose([Validators.required, Validators.min(1),Validators.max(7)])]
    })
  }

  apiURL = "";
  //html controllers
  loading: boolean = false;
  currentChapter;
  currentVolume;
  showQuran: boolean;
  showHadith: boolean;
  TheHadithaddress: hadithaddress;
  CurrentChapterSource = null;
  HADITHADDRESS: hadithaddress[];
  C;
  lastChaptervalue;
  lasthadithNumbervalue;
  TheCuurentSource: string = '';
  ayatMax: number;
  isValid:boolean=true;
  //FormControll
  rFH: FormGroup;
  rFQ: FormGroup;
  source_options:FormControl=new FormControl('Quran',Validators.required);


  //=======================================================================================ngOnInit//
  ngOnInit() {

    setTimeout(() => {
      this.web.Select_source.next('Quran');
      this.SetMaxAyat();
    }, 10);

    this.web.Loading.subscribe(b => this.loading = b);

    this.source_options.valueChanges.subscribe(
      (value) => {
        this.web.Select_source.next(value);
      }
    );

    this.web.Select_source.subscribe(r => {
      switch (r) {
        case "Bukhari":
          { this.showQuran = false;
            this.showHadith = true;
            this.CurrentChapterSource = Bukhari.length;
            this.HADITHADDRESS = Bukhari;
            this.C = 1;
            this.TheCuurentSource = 'hadith';
          }
          break;

        case "Muslim":
          { this.showQuran = false;this.showHadith = true;
            this.CurrentChapterSource = Muslim.length;
            this.HADITHADDRESS = Muslim;
            this.C = 2;
            this.TheCuurentSource = 'hadith';
          }
          break;

        case "Quran":
          { this.showQuran = true;this.showHadith = false;
            this.TheCuurentSource = 'quran';
          }
          break;

        default:{ this.showQuran = false;this.showHadith = false; } break;
      }
      
    });


    //=======Value Changes

    this.rFH.valueChanges.subscribe(
      form=>{
        //this.NextValid();
        //console.log(this.isValid);
        
      }
    )

    this.rFH.get('hadith_chapter').valueChanges.subscribe(
      value => {
        if (this.lastChaptervalue == value && this.rFH.get('hadith_chapter').status != 'VALID') return;

        this.currentChapter = value;
        this.TheHadithaddress = this.GetHadithAdressByBook(this.currentChapter, this.HADITHADDRESS);
        this.currentVolume = this.TheHadithaddress != null ? this.TheHadithaddress.volume : null;

        if (this.TheHadithaddress == null) return

        this.rFH.get('hadith_number').setValue(this.TheHadithaddress.from)
        this.rFH.get('hadith_number').setValidators([Validators.required,Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)
        ]);

        this.rFH.get('hadith_number_options').setValidators([Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)
        ]);


        this.lastChaptervalue = value;
        this.rFH.get('hadith_chapter_options').setValue(value);

      }
    )

    this.rFH.get('hadith_chapter_options').valueChanges.subscribe(
      value => {

        if (this.lastChaptervalue != value) {
          this.lastChaptervalue = value;
          this.currentChapter = value;
          this.rFH.get('hadith_chapter').setValue(Number(this.rFH.get('hadith_chapter_options').value));
        } else {
          return
        }
      }
    )

    this.rFH.get('hadith_number').valueChanges.subscribe(
      value => {
        if (this.lasthadithNumbervalue != value) {
          this.lasthadithNumbervalue = value;
          this.rFH.get('hadith_number_options').setValue(value);
        } else {
          return
        }
      }
    );

    this.rFH.get('hadith_number_options').valueChanges.subscribe(
      value => {
        if (this.lasthadithNumbervalue != value) {
          //this.rFH.get('hadith_number').setValue(Number(this.rFH.get('hadith_number_options').value));
          this.rFH.get('hadith_number').setValue(Number(this.rFH.get('hadith_number_options').value));
        } else {
          return
        }
      }
    );

    this.rFQ.get('surah_number').valueChanges.subscribe(
      value => {
        this.SetMaxAyat();
        this.rFQ.get('ayat_number').setValue(1)
        //this.rFQ.get('ayat_number').setValidators([Validators.required,Validators.max(this.ayatMax),Validators.min(1)])
      }
    )
    //Value Changes=======

  }//ngOnInit========================================================================================//






  //=====================================Error Messages//

  //==Hadith//
  getHadithChapternumberError() {
    return this.TheHadithaddress==null?'please set chapter number first':
      this.rFH.get('hadith_number').hasError("min") ? 'This book starts from ' + this.TheHadithaddress.from +' Hadiths' :
      this.rFH.get('hadith_number').hasError("max") ? 'This book ends at ' + this.TheHadithaddress.to +
      ' Hadiths' :
      this.rFH.get('hadith_number').hasError('required') ? 'required' :
      'Invalid input';
  }

  getChapternumberError() {
    return this.rFH.get('hadith_chapter').hasError("max") ? 'This chapter only has ' + this.CurrentChapterSource +
      ' books' :
      this.rFH.get('hadith_chapter').hasError('min') ? 'Minimum is 1' :
      this.rFH.get('hadith_chapter').hasError('required') ? 'required' :
      'Invalid input';
  }
  //Hadith==//

  //==Quran//
  getAyatNumberError() {
    return this.rFQ.get('ayat_number').hasError('required') ? 'required' :
      this.rFQ.get('ayat_number').hasError('max') ? 'this Surah only has ' + this.ayatMax + ' Ayat' :
      this.rFQ.get('ayat_number').hasError('min') ? 'Minimum is 1' :
      'Invalid input'
  }

  getSurahError() {
    return this.rFQ.get('surah_number').hasError('required') ? 'required' :
      this.rFQ.get('surah_number').hasError('max') ? 'The Quran has 114 Surrah' :
      this.rFQ.get('surah_number').hasError('min') ? 'Minimum is 1' :
      'Invalid input'
  }
  //Quran==//

  //Error Messages=====================================//


  LookUp() { //Look up
    switch (this.TheCuurentSource) {

      case 'hadith':
        {
          if(this.rFH.invalid) return;
          let _url ='https://muflihun.com/svc/hadith?c='+this.C+'&b='+this.currentChapter+'&h='+this.rFH.get('hadith_number').value;

          if (_url == this.apiURL) {
            this.snack.open("Already sent", "X", {
              duration: 1000
            });
            return
          }
          this.apiURL = _url;
          this.web.Loading.next(true);

          let _apiRequestHadith: ApiRequest = {
            c: this.C,
            url: this.apiURL,
            source: "hadith",
            hadithaddress: {
              chapter: this.currentChapter,
              hadith: this.rFH.get('hadith_number').value
            },
            language: "textArabic"
          };
          this.web.apiRequest$.next(_apiRequestHadith);
          console.log(_apiRequestHadith);
        } break;

      case 'quran':
        {
          if(this.rFQ.invalid)break;
          let _url = 'https://api.alquran.cloud/ayah/'+this.rFQ.get('surah_number').value+':'+this.rFQ.get('ayat_number').value+'/'+'ar'+'.asad';
          
          if (_url == this.apiURL){this.snack.open("Already sent", "X", { duration: 1000 }); return;}
          
          this.apiURL = _url;
          this.web.Loading.next(true);
          

          let _apiRequestHadith: ApiRequest = {
            c: null,
            url: this.apiURL,
            source: "quran",
            quranaddress: {
              surah: this.rFQ.get('surah_number').value,
              ayat: this.rFQ.get('ayat_number').value
            },
            language: "ar"
          };
          this.web.apiRequest$.next(_apiRequestHadith);
          console.log(_apiRequestHadith);
          
        }
        break;

      default: break;
    }
  }

  GetHadithAdressByBook(book, SOURCE: hadithaddress[]) {
    let x = SOURCE.filter(address => address.book == Number(book))
    return x[0];
  }



  SetMaxAyat() {
    let suran = this.rFQ.get('surah_number').value;
    if (suran <= 0||suran > 114) return
    let Surrah = QuranIndex.filter(f => f.number == suran);
    this.ayatMax = Surrah[0].numberOfAyahs;
    this.rFQ.get('ayat_number' ).setValidators([Validators.required, Validators.min(1),Validators.max(7)])
  }


  Previous() {

    if (this.TheCuurentSource == 'quran') {
      let ayat = this.rFQ.get('ayat_number').value - 1;
      if (ayat <= 0) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }
    if (this.TheCuurentSource == 'hadith') {
      let hadithNo = this.rFH.get('hadith_number').value - 1;
      if ( this.TheHadithaddress==null||hadithNo < this.TheHadithaddress.from) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }

  }

  Next() {

    if (this.TheCuurentSource == 'quran') {
      let ayat = this.rFQ.get('ayat_number').value + 1;
      if (ayat > this.ayatMax) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }

    if (this.TheCuurentSource == 'hadith') {
      let hadithNo = this.rFH.get('hadith_number').value + 1;
      if ( this.TheHadithaddress==null||hadithNo > this.TheHadithaddress.to) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }

  }



  //===========Testing==========//
  getvalidations(rF:FormGroup){
    console.log('====Validation');
    
    Object.keys(rF.controls).forEach(key => {

      let controlErrors: ValidationErrors = rF.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: "' + key + '", keyError: "' + keyError + '", err value: ', controlErrors[keyError]);
            });
          }
        });
    console.log('Validation====');

  }

} //CLASS