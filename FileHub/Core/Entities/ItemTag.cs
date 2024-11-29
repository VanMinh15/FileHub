using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class ItemTag
{
    public int ItemId { get; set; }

    public int TagId { get; set; }

    public string ItemType { get; set; } = null!;

    public virtual Tag Tag { get; set; } = null!;
}
