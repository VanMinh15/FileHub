namespace Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IFileRepository Files { get; }
        IFolderRepository Folders { get; }
        IUserRepository Users { get; }
        Task<int> CompleteAsync();
    }
}
