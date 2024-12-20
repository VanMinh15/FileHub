namespace Application.DTOs
{
    public class TokenDTO
    {
        public required string Token { get; set; }
        public string? RefreshToken { get; set; }
    }
}
