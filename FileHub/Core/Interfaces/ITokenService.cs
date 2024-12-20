using Application.DTOs;
using Application.Models;
using Google.Apis.Auth;

namespace Application.Interfaces
{
    public interface ITokenService
    {
        Task<TokenDTO> GenerateJwtTokenAsync(ApplicationUser user);
        Task<TokenDTO> GenerateAccessTokenAsync(ApplicationUser user);
        Task<TokenDTO> GenerateRefreshTokenAsync(ApplicationUser user);
        Task<ApiResponse<TokenDTO>> RefreshTokenAsync(string refreshToken);
        Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenAsync(string idToken);
    }

}
