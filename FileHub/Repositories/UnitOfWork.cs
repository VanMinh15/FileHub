using Application.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;

namespace Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FileHubContext _context;

        public UnitOfWork(FileHubContext context)
        {
            _context = context;
            Files = new FileRepository(_context);
            Folders = new FolderRepository(_context);
        }

        public IFileRepository Files { get; private set; }
        public IFolderRepository Folders { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}

