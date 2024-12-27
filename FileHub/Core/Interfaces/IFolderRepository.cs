using Application.DTOs;
using Application.Entities;
using Application.Models;

namespace Application.Interfaces
{
    public interface IFolderRepository : IBaseRepository<Folder>
    {
        Task<PaginatedList<RecentActivityDTO>> GetRecentFolders(string userId, PaginationParams paginationParams);
    }
}
