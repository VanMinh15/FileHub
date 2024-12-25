using Application.Interfaces;

namespace Application.Services
{
    public class FileService : IFileService
    {
        private readonly IFileRepository _fileRepository;
        private readonly IUserService _userService;
        public FileService(IUserService userService, IFileRepository fileRepository)
        {
            _userService = userService;
            _fileRepository = fileRepository;
        }

        //public async Task<ApiResponse> GetFilesByUserId(string userId)
        //{
        //    var existingUser = await _userService.FindByIdAsync(userId);


        //}

    }
}
