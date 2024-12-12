using Application.DTOs;
using Application.Models;
using Google.Apis.Auth;

namespace Application.Interfaces
{
    public interface ITokenService
    {
        Task<TokenDTO> GenerateJwtTokenAsync(ApplicationUser user);
        TokenDTO GenerateAccessToken(ApplicationUser user);
        TokenDTO GenerateRefreshToken(ApplicationUser user);
        ApiResponse<TokenDTO> RefreshToken(string refreshToken);
        Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenAsync(string idToken);
    }

}
