import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { IMyAPIFetchingMethod, Lib3 } from "../../interfaces";
import { MyServiceService } from "../../Services/my/my-handler.service";
import { WebService } from "../../Services/web/web.service";
import { RequestService } from "src/app/Services/request/request.service";
declare var $: any;

@Component({
  selector: "app-hadith-box",
  templateUrl: "./hadith-box.component.html",
  styleUrls: ["./hadith-box.component.css"]
})
export class HadithBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  //@Input()ArContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];
  //@Input() EnContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];

  constructor(
    public srv: MyServiceService,
    public web: WebService,
    private snack: MatSnackBar,
    public request:RequestService
  ) {}

  ngOnInit() {
    console.log("Hadith box ngOnInit()");
  } //ngOnInit

  randomId(index: number, index2: number) {
    var r = "yXqEyfZDpOLvPWhdcKzqTomGQYXqxutkyGElskQANcxFkDxNYWgIKhr";
    r = r + r + r + r + r + r + r + r + r + r;
    r = r + r;
    var s = "";
    for (var i = 0; i < 5; i++) {
      s += r.charAt(index + i + index2);
    }
    return s;
  }

  randomStr(m) {
    var m = m || 9;
    var s = "",
      r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < m; i++) {
      s += r.charAt(Math.floor(Math.random() * r.length));
    }
    return s;
  }

  CopyToClipboard(containerid) {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if ((document as any).selection) {
      // IE?
      (document as any).selection.empty();
    }

    if ((document as any).selection) {
      var range = (document.body as any).createTextRange();
      range.moveToElementText(document.getElementById(containerid));
      range.select().createTextRange();
      document.execCommand("copy");
    } else if (window.getSelection) {
      var range = document.createRange() as any;
      range.selectNode(document.getElementById(containerid));
      window.getSelection().addRange(range);
      document.execCommand("copy");
      this.snack.open("Copied", "x", { duration: 1000 });
    }
  }

  ngAfterViewInit() {
    console.log("Hadith box is loaded");
  }
  ngOnDestroy() {}
} //class
