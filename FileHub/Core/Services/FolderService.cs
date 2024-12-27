using Application.Interfaces;
using Application.Models;

namespace Application.Services
{
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IUserService _userService;
        public FolderService(IUserService userService, IFolderRepository folderRepository)
        {
            _userService = userService;
            _folderRepository = folderRepository;
        }
        public async Task<ApiResponse<object>> GetFoldersByUserId(string userId)
        {
            var existingUser = await _userService.FindByIdAsync(userId);
            if (!existingUser.Success)
            {
                return new ApiResponse<object>(false, "User not found", null);
            }

            var folders = _folderRepository.GetAll();
            var userFolders = folders.Where(f => f.SenderId == userId || f.ReceiverId == userId).ToList();

            return new ApiResponse<object>(true, "Folders retrieved successfully", userFolders);
        }

        public async Task<ApiResponse<object>> GetRecentFoldersByUserId(string userId)
        {
            var existingUser = await _userService.FindByIdAsync(userId);
            if (!existingUser.Success)
            {
                return new ApiResponse<object>(false, "User not found", null);
            }

            var folders = _folderRepository.GetAll();
            var userFolders = folders.Where(f => f.SenderId == userId || f.ReceiverId == userId)
                .OrderByDescending(f => f.CreatedAt).Take(5)
                .ToList();

            return new ApiResponse<object>(true, "Folders retrieved successfully", userFolders);
        }

        //public async Task<ApiResponse<object>> CreateFolder(FolderDTO folderDTO)
        //{
        //    var existingUser = await _userService.FindByIdAsync(folderDTO.SenderId);
        //    if (!existingUser.Success)
        //    {
        //        return new ApiResponse<object>(false, "User not found", null);
        //    }
        //    var folder = new Folder
        //    {
        //        Name = folderDTO.Name,
        //        SenderId = folderDTO.SenderId,
        //        ReceiverId = folderDTO.ReceiverId
        //    };
        //    _folderRepository.Add(folder);
        //    await _folderRepository.SaveChangesAsync();
        //    return new ApiResponse<object>(true, "Folder created successfully", folder);
        //}
    }
}
