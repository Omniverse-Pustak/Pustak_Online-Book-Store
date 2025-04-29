namespace Pustak.Dtos
{


    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }  // Add firstName here

        public int UserId { get; set; } // 👈 add this

        // If you have CartId concept, add it too
        public string? CartId { get; set; } // 👈 optional
    }

}