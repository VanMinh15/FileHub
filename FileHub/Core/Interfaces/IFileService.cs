using Application.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IFileService
    {
        Task<ApiResponse<object>> UploadFileAsync(IFormFile file, string senderID, string receiverID);
    }
}
