import { ComponentFixture, TestBed } from '@angular/core/testing';

import {GameDialogComponent } from './game-dialog.component';

describe('AddGameDialogComponent', () => {
  let component: GameDialogComponent;
  let fixture: ComponentFixture<GameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
