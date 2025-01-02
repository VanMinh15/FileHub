using Application.DTOs;
using Application.Entities;

namespace Application.Interfaces
{
    public interface IFolderRepository : IBaseRepository<Folder>
    {
        IQueryable<RecentActivityDTO> GetRecentFolders(string userId);
    }
}
