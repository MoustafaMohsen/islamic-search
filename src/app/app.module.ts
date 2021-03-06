import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
//modules
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//components
import { AppComponent } from "./Components/boot/app.component";
import { TopbarComponent } from "./Components/topbar/topbar.component";
import { HadithBoxComponent } from "./Components/hadith-box/hadith-box.component";

//routs
import { RouterModule } from "@angular/router";
import { routes } from "./Statics/routes";

//material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatSliderModule,
  MatCardModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatTabsModule
} from "@angular/material";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

//pipes
import { SafePipe } from "./Pipes/safe/safe.pipe";
import { NumberArrayPipe } from "./Pipes/number-array/number-array.pipe";
import { AddressArrayPipe } from "./Pipes/address-array/address-array.pipe";
import { ContainerComponent } from './Components/boot/container/container.component';
import { InputsComponent } from './Components/inputs/inputs.component';
import { FooterComponent } from './Components/footer/footer.component';

const material = [
  BrowserAnimationsModule,
  MatButtonModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatSliderModule,
  MatCardModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatIconModule,
  MatTabsModule
];

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    TopbarComponent,
    HadithBoxComponent,
    NumberArrayPipe,
    AddressArrayPipe,
    ContainerComponent,
    InputsComponent,
    FooterComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    //material
    material
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
