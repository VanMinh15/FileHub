using Application.DTOs;
using Application.Entities;
using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FolderRepository : BaseRepository<Folder>, IFolderRepository
    {
        private readonly FileHubContext _context;

        public FolderRepository(FileHubContext context) : base(context)
        {
            _context = context;

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

        public IQueryable<Folder> GetFoldersWithFriend(string senderID, string receiverID, DateTime? before = null)
        {
            var query = _dbSet
                .AsNoTracking()
                .Include(f => f.Sender)
                .Include(f => f.Receiver)
                .Where(f => (f.SenderId == senderID && f.ReceiverId == receiverID)
                         || (f.SenderId == receiverID && f.ReceiverId == senderID));

            if (before.HasValue)
            {
                query = query.Where(f => f.CreatedAt < before);
            }

            return query;
        }

    }
}
