import { Component } from "@angular/core";

@Component({
  selector: "app-root",

  template: `
      <!-- app-topbar></app-topbar -->
      <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = "app";
}
