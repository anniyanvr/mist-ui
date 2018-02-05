import { inject, async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { EndpointListComponent } from './functionName-list.component';
import { EndpointDataService } from '@services/functionName-data.service'
import { MockFunctionDataService } from '@mocks/function-data.service.mock'
import { mockFunction, mockFunctionList } from '@mocks/function.mock'

describe('FunctionListComponent', () => {
  let component: EndpointListComponent;
  let fixture: ComponentFixture<EndpointListComponent>;
  let mockEdSvc: MockFunctionDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule],
      declarations: [EndpointListComponent, SearchPipe],
      providers: [{ provide: EndpointDataService, useClass: mockEdSvc }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
