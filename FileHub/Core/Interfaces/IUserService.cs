using Application.Models;
using Microsoft.AspNetCore.Identity;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> Register(string email, string password);
        Task<ApplicationUser?> FindByIdAsync(string userId);
        Task<ApplicationUser?> FindByNameAsync(string userName);
        Task<IdentityResult> UpdateUserAsync(ApplicationUser user);
        Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure);
        Task SignOutAsync();
    }
}
