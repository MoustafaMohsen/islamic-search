export interface HadithBook{
    book:number;
    hadiths:hadith[];
  }
export interface hadith{
    hadith:string;
}
export interface HadithAddress{
  chapter:number;
  hadith:number;
}
export interface Quranaddress{
  surah:number;
  ayat:number;
}
export interface ApiRequest{
  c:number;
  url:string;
  source:string;
  hadithaddress?:HadithAddress;
  quranaddress?:Quranaddress;
  language:string;
}


export interface hadithaddress {
  book:number;
  volume?:number;
  from:number;
  to:number;
}
export interface hadithEnglishIndex{ 
  book: string; 
  bookName: string; 
  volume: string; 
}
//http://api.alquran.cloud/ayah/1:7/en.asad
//http://api.alquran.cloud/ayah/[[surah:number]]:[[ayat:number]]/[[language(en,ar,fr):string]].asad
export interface quranAyat{
  code: number;//request status code
  status: string; //request status state
  data: {
      number: number; //ayat number 
      text: string; // The ayat text **
      edition: {
          identifier: string;
          language: string;
          name: string;
          englishName: string;
          format: string;
          type: string;
      };
      surah: {
          number: number; //surah nummber 
          name: string; //surah name **
          englishName: string; //surrah name English**
          englishNameTranslation: string; //surrah name transelated English**
          numberOfAyahs: number; // max ayat number
          revelationType: string; //maccian/madanian
      };
      numberInSurah: number;
      juz: number;
      manzil: number;
      page: number;
      ruku: number;
      hizbQuarter: number;
      sajda: boolean;
  };

 
}

export interface QIndex{
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}




export interface APiHadithRequest{
  id?:number;
  src:number;
  number?: number;
  in_book_refrence?: APiIn_Book_Refrence;
  old_refrence?: APiOld_refrence
}

export interface APiOld_refrence{
  id?: number;
  vol: number;
  book: number;
  hadith: number;
}

export interface APiIn_Book_Refrence{
  id?: number;
  tag: string;
  book: number;
  hadith: number;
  vol?:number;
}

export interface HadithModel{
  id?:number,
  src?: number,
  number?: number,
  arabicHTML?: string,
  arabicText?: string,
  englishHTML?: string,
  englishText?: string,
  in_book_refrence?: APiIn_Book_Refrence,
  old_refrence?: APiOld_refrence
}


export interface ISource{
  source:{
    hadith:{
      status:boolean; muslim:boolean; bukhari:boolean; nasai:boolean;name?:string;srcNu:number
    };
    quran:boolean;
  };
  methodAPI:{
    oldAPI:{
      state:boolean;
      fethingmethod?:{
        status:boolean,
        ch:boolean,
        chOp:boolean,
        ha:boolean,
        haOp:boolean,
        nu:boolean
      } 
    };
    myAPI:IMyAPIFetchingMethod
  };
};

export interface IMyAPIFetchingMethod{
    status:boolean;
    new:{
      status:boolean;ch:boolean;vol:boolean;ha:boolean
    };
    old:{
      status:boolean;ch:boolean;vol:boolean;ha:boolean
    };
    tag:{
      status:boolean; type:string;
    }; 
    number:boolean;
}
export interface hadithIndexch{
  bnew: {
      nh: number;
      nc: number;
  }[];
  bold: {
      oh: number;
      oc: number;
  }[];
  maxNumber?:number;
  maxTag?:string;
  maxChar?:string;
}