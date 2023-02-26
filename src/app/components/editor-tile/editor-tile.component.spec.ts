import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTileComponent } from './editor-tile.component';

describe('ComponentsEditorTileComponent', () => {
  let component: EditorTileComponent;
  let fixture: ComponentFixture<EditorTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
