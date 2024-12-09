namespace Application.DTOs
{
    public class TokenDTO
    {
        public required string Token { get; set; }
        public required DateTime Expiration { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiration { get; set; }

    }
}
