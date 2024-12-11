using Application.DTOs;
using Application.Enums;
using Application.Interfaces;
using Application.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public UserService(
       UserManager<ApplicationUser> userManager,
       SignInManager<ApplicationUser> signInManager,
       ITokenService tokenService,
       IEmailSender emailSender,
       IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailSender = emailSender;
            _configuration = configuration;
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

        public async Task<ApiResponse<TokenDTO>> Login(LoginDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email.Trim());

            if (user == null)
                return new ApiResponse<TokenDTO>(false, "Invalid login attempt", null);

            if (await _userManager.IsLockedOutAsync(user))
            {
                var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                return new ApiResponse<TokenDTO>(false,
                    $"Account locked. Try again after {lockoutEnd?.LocalDateTime}",
                    null);
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                model.Password,
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var token = await _tokenService.GenerateJwtTokenAsync(user);
                return new ApiResponse<TokenDTO>(true, "Login successfully", token);
            }

            if (result.IsLockedOut)
                return new ApiResponse<TokenDTO>(false, "Account locked due to multiple failed attempts", null);

            return new ApiResponse<TokenDTO>(false, "Invalid login attempt", null);
        }

        public async Task<ApiResponse<object>> ForgotPassword(ForgotPasswordDTO forgotPasswordDTO)
        {
            var response = new ApiResponse<object>(
                success: true,
                message: "If your email is registered, you will receive a password reset link.",
                data: null,
                errors: null
            );

            var user = await _userManager.FindByEmailAsync(forgotPasswordDTO.Email);
            if (user == null)
            {
                return response;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var resetLink = $"{_configuration["AppUrl"]}/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";

            var subject = "Reset Your Password";
            var body = $@"
                <h2>Reset Your Password</h2>
                <p>Please click the link below to reset your password:</p>
                <a href=""{resetLink}"">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>";
            try
            {
                await _emailSender.SendEmailAsync(user.Email, subject, body);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ApiResponse<object>> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDTO.Email);
            if (user == null || user.Status != UserStatus.Active.Name)
            {
                return new ApiResponse<object>(
                    success: false,
                    message: "Password reset failed",
                    data: null,
                    errors: new[] { "User not found or invalid" }
                );
            }

            var result = await _userManager.ResetPasswordAsync(
                user,
                resetPasswordDTO.Token,
                resetPasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                return new ApiResponse<object>(
                    success: false,
                    message: "Password reset failed",
                    data: null,
                    errors: result.Errors.Select(e => e.Description)
                );
            }

            return new ApiResponse<object>(
                success: true,
                message: "Password reset successfully",
                data: null,
                errors: null
            );
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

        public async Task<ApiResponse<ApplicationUser>> FindByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new ApiResponse<ApplicationUser>(false, "Email not found", null);
            }
            return new ApiResponse<ApplicationUser>(true, "Email found", user);
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

        public async Task<ApiResponse<TokenDTO>> ExternalLoginAsync(ExternalLoginDTO externalLoginDTO)
        {
            // Validate the ID token
            var payload = await ValidateGoogleTokenAsync(externalLoginDTO.IdToken);
            if (payload == null)
            {
                return new ApiResponse<TokenDTO>(false, "Invalid Google token.", null);
            }

            // Check if the user exists
            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    EmailConfirmed = true,
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return new ApiResponse<TokenDTO>(false, "User created failed.", null, result.Errors.Select(e => e.Description));
                }

                await _userManager.AddToRoleAsync(user, "User");
            }

            // Generate JWT token
            var token = await _tokenService.GenerateJwtTokenAsync(user);
            return new ApiResponse<TokenDTO>(true, "Login successful.", token);
        }

        private async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenAsync(string idToken)
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

        public async Task SignOutAsync()
        {
            await _signInManager.SignOutAsync();
        }


    }
}
