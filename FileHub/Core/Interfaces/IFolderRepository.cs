using Application.DTOs;
using Application.Entities;

namespace Application.Interfaces
{
    public interface IFolderRepository : IBaseRepository<Folder>
    {
        IQueryable<RecentActivityDTO> GetRecentFolders(string userId);
        IQueryable<Folder> GetFoldersWithFriend(string senderID, string receiverID, DateTime? before = null);
    }
}
