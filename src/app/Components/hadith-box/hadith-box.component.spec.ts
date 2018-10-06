import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HadithBoxComponent } from './hadith-box.component';

describe('HadithBoxComponent', () => {
  let component: HadithBoxComponent;
  let fixture: ComponentFixture<HadithBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HadithBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HadithBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
