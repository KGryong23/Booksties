namespace IdentityService.Dtos.TokenDtos
{
    public record TokenDto
    {
        public Guid TokenId { get; set; }
        public Guid UserId { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRevoked { get; set; }
    }
}


