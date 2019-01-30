import { Component, OnInit } from "@angular/core";
import { MyServiceService } from "src/app/Services/my/my-handler.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.css"]
})
export class TopbarComponent implements OnInit {
  constructor(public srv:MyServiceService){}
  ngOnInit() {
  }

  setBukhari(){
    this.srv.source_options.setValue('bukhari');
  }
  setQuran(){
    this.srv.source_options.setValue('quran');
  }
  setMuslim(){
    this.srv.source_options.setValue('muslim');
  }
  
}