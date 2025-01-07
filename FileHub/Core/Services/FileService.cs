using Application.DTOs;
using Application.Entities;
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
                var fileActivities = await _unitOfWork.Files.GetFilesWithFriend(senderID, receiverID, before)
            .Select(f => new
            {
                Entity = (object)f,
                Type = "File",
                CreatedAt = f.CreatedAt
            })
            .ToListAsync();

                var folderActivities = await _unitOfWork.Folders.GetFoldersWithFriend(senderID, receiverID, before)
            .Select(f => new
            {
                Entity = (object)f,
                Type = "Folder",
                CreatedAt = f.CreatedAt
            })
            .ToListAsync();

                var combinedActivities = fileActivities
            .Concat(folderActivities)
            .OrderByDescending(a => a.CreatedAt);

                var items = combinedActivities
            .Take(pageSize + 1)
            .Select(a => CreateChatActivityDTO(a.Entity, a.Type, senderID))
            .ToList();

                var hasMore = items.Count > pageSize;
                if (hasMore)
                {
                    items.RemoveAt(items.Count - 1);
                }

                var nextTimestamp = items.LastOrDefault()?.CreatedAt;

                var result = new InfiniteScrollList<ChatActivityDTO>(items, hasMore, nextTimestamp);

                return new ApiResponse<InfiniteScrollList<ChatActivityDTO>>(true, "Recent activities retrieved successfully", result);
            }
            catch (Exception e)
            {
                return new ApiResponse<InfiniteScrollList<ChatActivityDTO>>(false, $"Error retrieving chat history: {e.Message}", null);
            }
        }


        private static ChatActivityDTO CreateChatActivityDTO(object entity, string type, string senderID)
        {
            if (type == "File" && entity is File file)
            {
                return new ChatActivityDTO
                {
                    Id = file.Id,
                    Name = file.Name,
                    Type = "File",
                    Action = file.SenderId == senderID ? "Sent" : "Received",
                    UserName = file.SenderId == senderID ? file.Receiver.UserName : file.Sender.UserName,
                    CreatedAt = file.CreatedAt,
                    FileType = file.FileType,
                    Size = file.FileSize,
                    Permission = file.Permission,
                    Metadata = new Dictionary<string, string>
            {
                { "FileType", file.FileType ?? string.Empty },
                { "Size", file.FileSize.ToString() },
                { "Version", file.VersionNumber.ToString() }
            }
                };
            }
            else if (type == "Folder" && entity is Folder folder)
            {
                return new ChatActivityDTO
                {
                    Id = folder.Id,
                    Name = folder.Name,
                    Type = "Folder",
                    Action = folder.SenderId == senderID ? "Sent" : "Received",
                    UserName = folder.SenderId == senderID ? folder.Receiver.UserName : folder.Sender.UserName,
                    CreatedAt = folder.CreatedAt,
                    ItemCount = folder.Files.Count,
                    Permission = folder.Permission,
                    Metadata = new Dictionary<string, string>
            {
                { "ItemCount", folder.Files.Count.ToString() },
                { "Permission", folder.Permission }
            }
                };
            }
            else
            {
                throw new InvalidOperationException("Unknown entity type");
            }
        }
    }
}
