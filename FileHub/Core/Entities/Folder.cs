using Application.Models;

namespace Application.Entities;

public partial class Folder
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int? ParentFolderId { get; set; }

    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;

    public string Permission { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<File> Files { get; set; } = new List<File>();

    public virtual ICollection<Folder> InverseParentFolder { get; set; } = new List<Folder>();

    public virtual Folder? ParentFolder { get; set; }
    public virtual ApplicationUser Sender { get; set; }
    public virtual ApplicationUser Receiver { get; set; }

}
