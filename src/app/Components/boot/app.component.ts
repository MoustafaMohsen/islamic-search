import { Component,OnInit } from "@angular/core";
import { GoogleService } from "../../Services/google.service";
import { AnalyticsId } from "src/app/Statics/configs";

@Component({
  selector: "app-root",

  template: `
      <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = "app";
  constructor(private googleServ:GoogleService){
  }
  ngOnInit(){
    this.googleServ.Script(AnalyticsId);
  }
}
