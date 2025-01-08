using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using File = Application.Entities.File;


namespace Infrastructure.Repositories
{
    public class FileRepository : BaseRepository<File>, IFileRepository
    {
        public FileRepository(FileHubContext context) : base(context)
        {
        }

        public IQueryable<RecentActivityDTO> GetRecentFiles(string userId)
        {
            return _dbSet
                .AsNoTracking()
                .Where(f => f.SenderId == userId || f.ReceiverId == userId)
                .Select(f => new RecentActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "File",
                    Action = f.SenderId == userId ? "Sent" : "Received",
                    UserName = f.SenderId == userId ? f.Receiver.UserName : f.Sender.UserName,
                    CreatedAt = f.CreatedAt
                });
        }

        public IQueryable<File> GetFilesWithFriend(string senderID, string receiverID, DateTime? before = null)
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
