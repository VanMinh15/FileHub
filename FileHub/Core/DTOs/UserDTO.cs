﻿using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string UserName { get; set; }
        [Required]
        public required string Password { get; set; }
    }

    public class UpdateDTO
    {
        [Required]
        public required string Id { get; set; }
        [Required]
        public string? UserName { get; set; }

        public string? Email { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class LoginDTO
    {
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }

    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }

    public class ResetPasswordDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Token { get; set; }

        [Required]
        public required string NewPassword { get; set; }

        [Compare("NewPassword")]
        public required string ConfirmPassword { get; set; }
    }

    public class ExternalLoginDTO
    {
        public string Provider { get; set; } = "Google";
        public string IdToken { get; set; } = string.Empty;
    }

    public class UserResponseDTO
    {
        [Required]
        public required string Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
    }
    public class UploadFileDTO
    {
        public required IFormFile File { get; set; }
        public required string ReceiverID { get; set; }
        public string? Description { get; set; }
    }
    public class SearchReceiverDTO
    {
        public string? Keyword { get; set; }
        public required string SenderID { get; set; }
    }

}
