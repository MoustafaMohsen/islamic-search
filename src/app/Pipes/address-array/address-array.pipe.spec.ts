import { AddressArrayPipe } from './address-array.pipe';

describe('AddressArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new AddressArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
