import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookItemComponent } from './user-book-item.component';

describe('UserBookItemComponent', () => {
  let component: UserBookItemComponent;
  let fixture: ComponentFixture<UserBookItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBookItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBookItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
