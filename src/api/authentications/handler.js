class AuthenticationHandlers {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this.authenticationsService = authenticationsService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  // ---------------------------------------------------------Post Authentiction
  async postAuthenticationHandler(request, h) {
    this.validator.validatePostAuthenticationPayload(request.payload);
    const { username, password } = request.payload;
    const id = await this.usersService.verifyUserCredential(username, password);
    const refreshToken = this.tokenManager.generateRefreshToken({ id });
    const accessToken = this.tokenManager.generateAccessToken({ id });
    await this.authenticationsService.addRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  // ---------------------------------------------------------Put Authentiction
  async putAuthenticationHandler(request, h) {
    this.validator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    const id = this.tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  // ---------------------------------------------------------Delete Authentiction
  async deleteAuthenticationHandler(request, h) {
    this.validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    await this.authenticationsService.deleteRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus refresh token',
    });

    response.code(200);
    return response;
  }
}
module.exports = AuthenticationHandlers;
