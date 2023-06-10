import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WetterPanelComponent } from './wetter-panel.component';

describe('WetterPanelComponent', () => {
  let component: WetterPanelComponent;
  let fixture: ComponentFixture<WetterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WetterPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WetterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
