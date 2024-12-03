using Application.Interfaces;
using Infrastructure.Data;
using File = Application.Entities.File;


namespace Infrastructure.Repositories
{
    public class FileRepository : BaseRepository<File>, IFileRepository
    {
        public FileRepository(FileHubContext context) : base(context)
        {
        }
    }
}
