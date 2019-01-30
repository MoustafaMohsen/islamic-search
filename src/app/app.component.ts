import { Component } from "@angular/core";

@Component({
  selector: "app-root",

  template: `
    <div class="container">
      <!-- app-topbar></app-topbar -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = "app";
}
