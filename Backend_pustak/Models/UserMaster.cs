namespace Pustak.Models
{
    public class UserMaster
    {
        public int UserID { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public int UserTypeID { get; set; }
        public UserType UserType { get; set; } = null!;
    }
}
