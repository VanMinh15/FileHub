using Application.DTOs;
using Application.Entities;
using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FolderRepository : BaseRepository<Folder>, IFolderRepository
    {
        public FolderRepository(FileHubContext context) : base(context)
        {
        }

        public IQueryable<RecentActivityDTO> GetRecentFolders(string userId)
        {
            return _dbSet
                .AsNoTracking()
                .Where(f => f.SenderId == userId || f.ReceiverId == userId)
                .Select(f => new RecentActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "Folder",
                    Action = f.SenderId == userId ? "Sent" : "Received",
                    UserName = f.SenderId == userId ? f.Receiver.UserName : f.Sender.UserName,
                    CreatedAt = f.CreatedAt
                });
        }
    }
}
