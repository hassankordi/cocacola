/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MachineIndecatorComponent } from './machine-indecator.component';

describe('MachineIndecatorComponent', () => {
  let component: MachineIndecatorComponent;
  let fixture: ComponentFixture<MachineIndecatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineIndecatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineIndecatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
