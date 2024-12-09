using Application.DTOs;
using Application.Models;
using Microsoft.AspNetCore.Identity;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<IdentityResult>> Register(RegisterDTO registerDTO);
        Task<ApiResponse<ApplicationUser>> FindByIdAsync(string userId);
        Task<ApiResponse<ApplicationUser>> FindByNameAsync(string userName);
        Task<ApiResponse<IdentityResult>> UpdateUserProfile(UpdateDTO updateDTO);
        Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure);
        Task SignOutAsync();
    }
}
