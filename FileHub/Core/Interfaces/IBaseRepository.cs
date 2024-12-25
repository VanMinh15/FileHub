using Application.Models;

namespace Application.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<PaginatedList<U>> GetPaginatedAsync<U>(IQueryable<U> query, int pageIndex, int pageSize);
    }
}
