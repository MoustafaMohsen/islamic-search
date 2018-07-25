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