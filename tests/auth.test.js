const Auth = require('../js/auth.js');

describe('Auth', () => {
  test('register validates fields and password length', () => {
    expect(Auth.register('', 'a@test.com', '1234')).toEqual({
      success: false,
      error: 'All fields are required'
    });

    expect(Auth.register('A', 'a@test.com', '123')).toEqual({
      success: false,
      error: 'Password must be at least 4 characters'
    });
  });

  test('register creates user and logs in', () => {
    const result = Auth.register('A', 'a@test.com', '1234');
    expect(result.success).toBe(true);
    expect(Auth.isLoggedIn()).toBe(true);
    expect(Auth.getCurrentUser().email).toBe('a@test.com');
  });

  test('login fails with wrong credentials', () => {
    Auth.register('A', 'a@test.com', '1234');
    Auth.logout();

    const result = Auth.login('a@test.com', 'bad-pass');
    expect(result).toEqual({
      success: false,
      error: 'Invalid email or password'
    });
    expect(Auth.isLoggedIn()).toBe(false);
  });
});
