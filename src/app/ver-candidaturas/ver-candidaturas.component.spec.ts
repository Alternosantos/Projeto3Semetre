import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCandidaturasComponent } from './ver-candidaturas.component';

describe('VerCandidaturasComponent', () => {
  let component: VerCandidaturasComponent;
  let fixture: ComponentFixture<VerCandidaturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCandidaturasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCandidaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
