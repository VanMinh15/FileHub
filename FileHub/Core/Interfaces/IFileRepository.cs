using Application.DTOs;
using Application.Models;
using File = Application.Entities.File;

namespace Application.Interfaces
{
    public interface IFileRepository : IBaseRepository<File>
    {
        Task<PaginatedList<RecentActivityDTO>> GetRecentFiles(string userId, PaginationParams paginationParams);
    }
}
