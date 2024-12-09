namespace Application.Models
{
    public class JWTSettings
    {
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public required string SecretKey { get; set; }

    }
}
