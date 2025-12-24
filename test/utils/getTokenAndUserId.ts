import { authRoutes } from '../endpoints';

const getTokenAndUserId = async (request) => {
  const createUserDto = {
    login: `TEST_AUTH_LOGIN_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    password: 'Tu6!@#%&',
  };

  const signupRes = await request
    .post(authRoutes.signup)
    .set('Accept', 'application/json')
    .send(createUserDto);

  if (signupRes.statusCode !== 201) {
    throw new Error(
      `Signup failed in getTokenAndUserId, status: ${signupRes.statusCode}`,
    );
  }

  const mockUserId = signupRes.body?.id;

  const loginRes = await request
    .post(authRoutes.login)
    .set('Accept', 'application/json')
    .send(createUserDto);

  const accessToken = loginRes.body?.accessToken;
  const refreshToken = loginRes.body?.refreshToken;

  if (!mockUserId || !accessToken) {
    throw new Error('Authorization is not implemented');
  }

  return {
    token: `Bearer ${accessToken}`,
    accessToken,
    refreshToken,
    mockUserId,
    login: createUserDto.login,
  };
};

export default getTokenAndUserId;
