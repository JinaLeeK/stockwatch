/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { StockService } from './stock.service';

describe('Service: Stock', () => {
  beforeEach(() => {
    addProviders([StockService]);
  });

  it('should ...',
    inject([StockService],
      (service: StockService) => {
        expect(service).toBeTruthy();
      }));
});
