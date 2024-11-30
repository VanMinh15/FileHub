using System;
using System.Collections.Generic;

namespace Application.Entities;

public partial class File
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public long FileSize { get; set; }

    public string? FileType { get; set; }

    public string StoragePath { get; set; } = null!;

    public byte[] Content { get; set; } = null!;

    public int VersionNumber { get; set; }

    public int? FolderId { get; set; }

    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;

    public string Permission { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Folder? Folder { get; set; }

    public virtual AspNetUser Receiver { get; set; } = null!;

    public virtual AspNetUser Sender { get; set; } = null!;
}
