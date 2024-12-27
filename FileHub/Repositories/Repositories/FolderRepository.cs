using Application.DTOs;
using Application.Entities;
using Application.Interfaces;
using Application.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FolderRepository : BaseRepository<Folder>, IFolderRepository
    {
        public FolderRepository(FileHubContext context) : base(context)
        {
        }

        public async Task<PaginatedList<RecentActivityDTO>> GetRecentFolders(string userId, PaginationParams paginationParams)
        {
            var query = _dbSet
                .AsNoTracking()
                .Where(f => f.SenderId == userId || f.ReceiverId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new RecentActivityDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = "Folder",
                    Action = f.SenderId == userId ? "Sent" : "Received",
                    CreatedAt = f.CreatedAt
                });

            return await GetPaginatedAsync(query, paginationParams.PageIndex, paginationParams.PageSize);
        }
    }
}
