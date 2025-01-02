using Application.DTOs;
using Application.Enums;
using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using File = Application.Entities.File;

namespace Application.Services
{
    public class FileService : IFileService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;
        private readonly long _maxFileSize;
        public FileService(IUserService userService, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _maxFileSize = configuration.GetValue<long>("FileUpload:MaxFileSize");
        }

        public async Task<ApiResponse<object>> UploadFileAsync(IFormFile file, string senderID, string receiverID)
        {
            if (file == null || file.Length == 0)
            {
                return new ApiResponse<object>(false, "Invalid file", null);
            }

            if (file.Length > _maxFileSize)
            {
                return new ApiResponse<object>(false, $"File size exceeds the limit of {_maxFileSize / (1024 * 1024)} MB", null);
            }
            try
            {
                var newFile = new File
                {
                    Name = file.FileName,
                    FileSize = file.Length,
                    FileType = file.ContentType,
                    SenderId = senderID,
                    ReceiverId = receiverID,
                    Permission = FilePermission.Public.Name,
                    CreatedAt = DateTime.UtcNow
                };

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    newFile.Content = stream.ToArray();
                }

                await _unitOfWork.Files.AddAsync(newFile);
                await _unitOfWork.CompleteAsync();

                return new ApiResponse<object>(true, "File uploaded successfully", null);
            }
            catch (Exception e)
            {
                return new ApiResponse<object>(false, $"Error uploading file: {e.Message}", null);
            }
        }

        public async Task<ApiResponse<PaginatedList<RecentActivityDTO>>> GetRecentActivitiesAsync(string userId, PaginationParams paginationParams)
        {
            var fileActivities = _unitOfWork.Files.GetRecentFiles(userId);
            var folderActivities = _unitOfWork.Folders.GetRecentFolders(userId);

            var combinedActivities = fileActivities
                .Concat(folderActivities)
                .OrderByDescending(a => a.CreatedAt);

            var paginatedActivities = await _unitOfWork.Files.GetPaginatedAsync(
                combinedActivities,
            paginationParams.PageIndex,
            paginationParams.PageSize);

            return new ApiResponse<PaginatedList<RecentActivityDTO>>(true, "Recent activities retrieved successfully", paginatedActivities);
        }
    }


}
