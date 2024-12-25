using Application.Interfaces;
using Application.Models;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FileHubContext _context;

        public UnitOfWork(FileHubContext context, UserManager<ApplicationUser> userManager, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<ApplicationUser> passwordHasher, IEnumerable<IUserValidator<ApplicationUser>> userValidators, IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<ApplicationUser>> logger)
        {
            _context = context;
            Files = new FileRepository(_context);
            Folders = new FolderRepository(_context);
            Users = new UserRepository(_context, new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_context), optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger));
        }

        public IFileRepository Files { get; private set; }
        public IFolderRepository Folders { get; private set; }
        public IUserRepository Users { get; private set; }

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
