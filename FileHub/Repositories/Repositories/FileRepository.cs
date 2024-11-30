using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using File = Application.Entities.File;


namespace Infrastructure.Repositories
{
    public class FileRepository : BaseRepository<File>, IFileRepository
    {
        public FileRepository(DbContext context) : base(context)
        {
        }
    }
}
