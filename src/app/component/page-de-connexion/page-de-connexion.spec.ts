import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeConnexion } from './page-de-connexion';

describe('PageDeConnexion', () => {
  let component: PageDeConnexion;
  let fixture: ComponentFixture<PageDeConnexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDeConnexion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDeConnexion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
