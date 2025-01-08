using Application.DTOs;
using Application.Enums;
using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

        public async Task<ApiResponse<InfiniteScrollList<ChatActivityDTO>>> GetChatHistoryAsync(string senderID, string receiverID, DateTime? before = null, int pageSize = 20)
        {
            try
            {
                var activities = (await CreateChatActivitiesQuery(senderID, receiverID, before))
               .OrderByDescending(x => x.CreatedAt)
               .Take(pageSize + 1)
               .ToList();

                var hasMore = activities.Count > pageSize;
                if (hasMore)
                {
                    activities.RemoveAt(activities.Count - 1);
                }

                var result = new InfiniteScrollList<ChatActivityDTO>(
                    activities,
                    hasMore,
                    activities.LastOrDefault()?.CreatedAt
                );

                return new ApiResponse<InfiniteScrollList<ChatActivityDTO>>(
                    true,
                    "Chat history retrieved successfully",
                    result);
            }
            catch (Exception ex)
            {
                return new ApiResponse<InfiniteScrollList<ChatActivityDTO>>(
                    false,
                    $"Error retrieving chat history: {ex.Message}",
                    null);
            }
        }

        private async Task<IEnumerable<ChatActivityDTO>> CreateChatActivitiesQuery(
       string senderID,
       string receiverID,
       DateTime? before)
        {
            // Execute queries separately and combine results in memory
            var files = await _unitOfWork.Files.GetFilesWithFriend(senderID, receiverID, before)
                .Select(f => new ChatActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "File",
                    Action = f.SenderId == senderID ? "Sent" : "Received",
                    UserName = f.SenderId == senderID ? f.Receiver.UserName : f.Sender.UserName,
                    CreatedAt = f.CreatedAt,
                    FileType = f.FileType,
                    Size = f.FileSize,
                    Permission = f.Permission,
                    Metadata = new Dictionary<string, string>
                    {
                    { "FileType", f.FileType ?? string.Empty },
                    { "Size", f.FileSize.ToString() },
                    { "Version", f.VersionNumber.ToString() }
                    }
                })
                .ToListAsync();

            var folders = await _unitOfWork.Folders.GetFoldersWithFriend(senderID, receiverID, before)
                .Select(f => new ChatActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "Folder",
                    Action = f.SenderId == senderID ? "Sent" : "Received",
                    UserName = f.SenderId == senderID ? f.Receiver.UserName : f.Sender.UserName,
                    CreatedAt = f.CreatedAt,
                    ItemCount = f.Files.Count,
                    Permission = f.Permission,
                    Metadata = new Dictionary<string, string>
                    {
                    { "ItemCount", f.Files.Count.ToString() },
                    { "Permission", f.Permission }
                    }
                })
                .ToListAsync();

            // Combine and order in memory
            return files.Concat(folders);
        }
    }
}
