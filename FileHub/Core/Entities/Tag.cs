using Application.Models;

namespace Application.Entities;

public partial class Tag
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string OwnerId { get; set; } = null!;

    public virtual ICollection<ItemTag> ItemTags { get; set; } = new List<ItemTag>();
    public virtual ApplicationUser Owner { get; set; }

}
