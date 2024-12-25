using Application.DTOs;
using Application.Models;
using Microsoft.AspNetCore.Identity;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<IdentityResult>> Register(RegisterDTO registerDTO);
        Task<ApiResponse<UserResponseDTO>> FindByIdAsync(string userId);
        Task<ApiResponse<UserResponseDTO>> FindByNameAsync(string userName);
        Task<ApiResponse<UserResponseDTO>> FindByEmailAsync(string email);
        Task<ApiResponse<PaginatedList<UserResponseDTO>>> FindReceiver(string? keyword, string senderId, PaginationParams paginationParams);
        Task<ApiResponse<IdentityResult>> UpdateUserProfile(UpdateDTO updateDTO);
        Task<ApiResponse<TokenDTO>> Login(LoginDTO model);
        Task<ApiResponse<object>> ForgotPassword(ForgotPasswordDTO forgotPasswordDTO);
        Task<ApiResponse<object>> ResetPassword(ResetPasswordDTO resetPasswordDTO);
        Task<ApiResponse<TokenDTO>> ExternalLoginAsync(ExternalLoginDTO externalLoginDTO);

    }
}
