using Application.DTOs;
using Application.Enums;
using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Identity;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<ApiResponse<IdentityResult>> Register(RegisterDTO registerDTO)
        {
            var user = new ApplicationUser
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                Status = UserStatus.Active.Name
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            await _userManager.AddToRoleAsync(user, "User");

            if (result.Succeeded)
            {
                return new ApiResponse<IdentityResult>(true, "Register succesfully", result);
            }
            else
            {
                return new ApiResponse<IdentityResult>(false, "Register failed", result);
            }
        }

        public async Task<ApiResponse<ApplicationUser>> FindByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new ApiResponse<ApplicationUser>(false, "User not found", null);
            }
            return new ApiResponse<ApplicationUser>(true, "User found", user);
        }

        public async Task<ApiResponse<ApplicationUser>> FindByNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return new ApiResponse<ApplicationUser>(false, "User not found", null);
            }
            return new ApiResponse<ApplicationUser>(true, "User found", user);
        }


        public async Task<ApiResponse<IdentityResult>> UpdateUserProfile(UpdateDTO updateDTO)
        {
            var user = await _userManager.FindByIdAsync(updateDTO.Id);

            if (user == null)
                return new ApiResponse<IdentityResult>(false, "User not found", null);

            user.UserName = updateDTO.UserName?.Trim();
            user.Email = updateDTO.Email?.Trim();

            if (!string.IsNullOrEmpty(updateDTO.NewPassword))
            {
                if (string.IsNullOrEmpty(updateDTO.CurrentPassword))
                {
                    return new ApiResponse<IdentityResult>(false, "Current password is required to reset", null);
                }

                var checkCurrentPassword = await _userManager.CheckPasswordAsync(user, updateDTO.CurrentPassword);
                if (!checkCurrentPassword)
                {
                    return new ApiResponse<IdentityResult>(false, "Current password is invalid", null);
                }

                var passwordChange = await _userManager.ChangePasswordAsync(user, updateDTO.CurrentPassword, updateDTO.NewPassword);
                if (!passwordChange.Succeeded)
                {
                    return new ApiResponse<IdentityResult>(false, "Failed to change password", passwordChange, passwordChange.Errors.Select(e => e.Description));
                }
            }
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded
        ? new ApiResponse<IdentityResult>(true, "Profile updated successfully", result)
        : new ApiResponse<IdentityResult>(false, "Update failed", result, result.Errors.Select(e => e.Description));
        }

        public async Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure)
        {
            return await _signInManager.PasswordSignInAsync(userName, password, isPersistent, lockoutOnFailure);
        }

        public async Task SignOutAsync()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
