using Application.DTOs;
using Application.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IFileService
    {
        Task<ApiResponse<object>> UploadFileAsync(IFormFile file, string senderID, string receiverID);
        Task<ApiResponse<PaginatedList<RecentActivityDTO>>> GetRecentActivitiesAsync(string userId, PaginationParams paginationParams);
        Task<ApiResponse<InfiniteScrollList<ChatActivityDTO>>> GetChatHistoryAsync(string senderID, string receiverID, DateTime? before = null, int pageSize = 20);
    }
}
