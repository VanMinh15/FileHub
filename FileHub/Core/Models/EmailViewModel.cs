namespace Application.Models
{
    public class EmailViewModel
    {
        public string UserName { get; set; } = string.Empty;
        public string ResetLink { get; set; } = string.Empty;
        public string TokenExpiryTime { get; set; } = "15 minutes";
    }
}
