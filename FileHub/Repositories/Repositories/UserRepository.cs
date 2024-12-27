using Application.DTOs;
using Application.Enums;
using Application.Interfaces;
using Application.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<ApplicationUser>, IUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UserRepository(FileHubContext context, UserManager<ApplicationUser> userManager) : base(context)
        {
            _userManager = userManager;
        }
        public async Task<ApiResponse<UserResponseDTO>> FindByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new ApiResponse<UserResponseDTO>(false, "User not found", null);
            }

            var userDTO = new UserResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };

            return new ApiResponse<UserResponseDTO>(true, "User found", userDTO);
        }

        public async Task<ApiResponse<UserResponseDTO>> FindByNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return new ApiResponse<UserResponseDTO>(false, "User not found", null);
            }

            var userDTO = new UserResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };

            return new ApiResponse<UserResponseDTO>(true, "User found", userDTO);
        }

        public async Task<ApiResponse<UserResponseDTO>> FindByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new ApiResponse<UserResponseDTO>(false, "Email not found", null);
            }

            var userDTO = new UserResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };

            return new ApiResponse<UserResponseDTO>(true, "Email found", userDTO);
        }

        public async Task<PaginatedList<UserResponseDTO>> SearchReceiverByEmailOrUserName(string? keyword, string senderID, PaginationParams paginationParams)
        {
            if (string.IsNullOrWhiteSpace(keyword)) { keyword = string.Empty; }

            var currentUserId = FindByIdAsync(senderID);
            keyword = keyword.Trim().ToUpper();

            var query = _dbSet
                .AsNoTracking()
                .Where(u =>
                    u.Id != currentUserId.Result.Data.Id &&
                    u.Status == UserStatus.Active.Name &&
                    (u.NormalizedEmail.Contains(keyword) || u.NormalizedUserName.Contains(keyword)))
                .Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                });

            var paginatedResult = await GetPaginatedAsync(query, paginationParams.PageIndex, paginationParams.PageSize);

            return new PaginatedList<UserResponseDTO>(
                paginatedResult.Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email
                }).ToList(),
                paginatedResult.TotalCount,
                paginatedResult.PageIndex,
                paginatedResult.PageSize
            );
        }

    }
}
