using Application.Entities;
using Application.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class FolderRepository : BaseRepository<Folder>, IFolderRepository
    {
        public FolderRepository(FileHubContext context) : base(context)
        {
        }
    }
}
