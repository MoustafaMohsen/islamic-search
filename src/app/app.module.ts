import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//modules
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//components
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { HadithBoxComponent } from './hadith-box/hadith-box.component';

//routs
import { RouterModule } from '@angular/router'; 
import { routes } from "./routes";

//material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule,MatButtonToggleModule,MatSliderModule,
  MatCardModule,MatProgressBarModule,MatToolbarModule,MatAutocompleteModule
  ,MatSlideToggleModule,MatSnackBarModule,MatDividerModule,MatProgressSpinnerModule
  ,MatIconModule,MatTabsModule
} from '@angular/material';
import { MatInputModule } from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

//pipes
import { SafePipe } from './safe.pipe';
import { NumberArrayPipe } from './number-array.pipe';
import { AddressArrayPipe } from './address-array.pipe';


const material=[
  BrowserAnimationsModule,
  MatButtonModule, MatCheckboxModule,MatButtonToggleModule,
  MatSliderModule,MatCardModule,MatProgressBarModule,MatToolbarModule,MatAutocompleteModule,
  MatFormFieldModule,MatSlideToggleModule,MatSnackBarModule,MatDividerModule,MatProgressSpinnerModule,
  MatInputModule,MatIconModule,MatTabsModule
]

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    TopbarComponent,
    HadithBoxComponent,
    NumberArrayPipe,
    AddressArrayPipe
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
export class AppModule { }
