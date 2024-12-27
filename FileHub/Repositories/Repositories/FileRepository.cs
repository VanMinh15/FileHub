using Application.DTOs;
using Application.Interfaces;
using Application.Models;
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

        public async Task<PaginatedList<RecentActivityDTO>> GetRecentFiles(string userId, PaginationParams paginationParams)
        {
            var query = _dbSet
                .AsNoTracking()
                .Where(f => f.SenderId == userId || f.ReceiverId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new RecentActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "File",
                    Action = f.SenderId == userId ? "Sent" : "Received",
                    CreatedAt = f.CreatedAt
                });

            return await GetPaginatedAsync(query, paginationParams.PageIndex, paginationParams.PageSize);
        }
    }

}
