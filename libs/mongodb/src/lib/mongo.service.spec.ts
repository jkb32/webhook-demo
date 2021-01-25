import { mongoService } from './mongodb';

describe('mongodb', () => {
  it('should work', () => {
    expect(mongoService()).toEqual('mongodb');
  });
});
