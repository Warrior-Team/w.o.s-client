import { TestBed } from '@angular/core/testing';

import { SocketsManagerService } from './sockets-manager.service';

describe('SocketsManagerService', () => {
  let service: SocketsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
