namespace Application.DTOs
{
    public class RecentActivityDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; } // "File" or "Folder"
        public required string Action { get; set; } // "Sent" or "Received"
        public DateTime? CreatedAt { get; set; }
    }
}
