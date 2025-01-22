import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTeacherComponent } from './add-teachers.component';

describe('AddTeachersComponent', () => {
  let component: AddTeacherComponent;
  let fixture: ComponentFixture<AddTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
