using Application.DTOs;
using Application.Interfaces;
using Application.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JWTSettings _jwtSettings;
        private readonly IConfiguration _configuration;


        public TokenService(UserManager<ApplicationUser> userManager, IOptions<JWTSettings> jwtSettings, IConfiguration configuration)
        {
            _userManager = userManager;
            _jwtSettings = jwtSettings.Value;
            _configuration = configuration;
        }

        public async Task<TokenDTO> GenerateJwtTokenAsync(ApplicationUser user)
        {
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken(user);

            return new TokenDTO
            {
                Token = accessToken.Token,
                Expiration = accessToken.Expiration,
                RefreshToken = refreshToken.Token,
                RefreshTokenExpiration = refreshToken.Expiration
            };
        }

        public TokenDTO GenerateAccessToken(ApplicationUser user)
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);
            var userRoles = _userManager.GetRolesAsync(user).Result;

            var authClaims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(key);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                expires: DateTime.UtcNow.AddMinutes(60),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new TokenDTO
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            };
        }

        public TokenDTO GenerateRefreshToken(ApplicationUser user)
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

            var authClaims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

            var authSigningKey = new SymmetricSecurityKey(key);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                expires: DateTime.UtcNow.AddDays(7),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new TokenDTO
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            };
        }

        public ApiResponse<TokenDTO> RefreshToken(string refreshToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

            try
            {
                var principal = tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                if (validatedToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return new ApiResponse<TokenDTO>(false, "Invalid token", null);
                }

                var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = _userManager.FindByIdAsync(userId).Result;

                if (user == null)
                    return new ApiResponse<TokenDTO>(false, "User not found", null);

                var newTokens = GenerateJwtTokenAsync(user).Result;
                return new ApiResponse<TokenDTO>(true, "Token refreshed successfully", newTokens);
            }
            catch (SecurityTokenExpiredException)
            {
                return new ApiResponse<TokenDTO>(false, "Refresh token has expired", null);
            }
            catch (Exception)
            {
                return new ApiResponse<TokenDTO>(false, "Invalid token", null);
            }
        }
        public async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenAsync(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new[] { _configuration["Authentication:Google:ClientId"] }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }
    }
}
