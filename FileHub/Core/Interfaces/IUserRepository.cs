using Application.DTOs;
using Application.Models;

namespace Application.Interfaces
{
    public interface IUserRepository : IBaseRepository<ApplicationUser>
    {
        Task<ApiResponse<UserResponseDTO>> FindByIdAsync(string userId);
        Task<ApiResponse<UserResponseDTO>> FindByNameAsync(string userName);
        Task<ApiResponse<UserResponseDTO>> FindByEmailAsync(string email);
        Task<PaginatedList<UserResponseDTO>> SearchReceiverByEmailOrUserName(string? keyword, string senderID, PaginationParams paginationParams);
    }
}
