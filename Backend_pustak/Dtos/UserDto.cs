namespace Pustak.Dtos
{
    public class UserDto
    {
        public int UserID { get; set; }
        public string Username { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
