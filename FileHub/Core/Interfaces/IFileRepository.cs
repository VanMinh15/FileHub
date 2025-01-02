using Application.DTOs;
using File = Application.Entities.File;

namespace Application.Interfaces
{
    public interface IFileRepository : IBaseRepository<File>
    {
        IQueryable<RecentActivityDTO> GetRecentFiles(string userId);
    }
}
