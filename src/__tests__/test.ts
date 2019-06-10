import Logging from '../index';

test('Instantion', () => {
    expect(new Logging()).toBeInstanceOf(Logging);
});