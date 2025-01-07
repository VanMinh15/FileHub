namespace Application.DTOs
{
    public class ChatActivityDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; } // "File" or "Folder"
        public required string Action { get; set; } // "Sent" or "Received"
        public required string UserName { get; set; }
        public DateTime? CreatedAt { get; set; }

        // File-specific properties
        public string? FileType { get; set; }
        public long? Size { get; set; }

        // Folder-specific properties
        public int? ItemCount { get; set; }

        public string? Permission { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
    }
    public class ChatHistoryDTO
    {
        public required string ReceiverID { get; set; }
        public DateTime? Before { get; set; }
        public int PageSize { get; set; } = 20;
    }
}
