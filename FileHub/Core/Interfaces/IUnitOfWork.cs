namespace Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IFileRepository Files { get; }
        IFolderRepository Folders { get; }
        Task<int> CompleteAsync();
    }
}
