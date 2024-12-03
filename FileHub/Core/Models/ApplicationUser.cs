using Application.Entities;
using Microsoft.AspNetCore.Identity;
using File = Application.Entities.File;

namespace Application.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Status { get; set; }

        public virtual ICollection<File> FileSenders { get; set; } = new List<File>();
        public virtual ICollection<File> FileReceivers { get; set; } = new List<File>();
        public virtual ICollection<Folder> FolderSenders { get; set; } = new List<Folder>();
        public virtual ICollection<Folder> FolderReceivers { get; set; } = new List<Folder>();
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();


    }
}
