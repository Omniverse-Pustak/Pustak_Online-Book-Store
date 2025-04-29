namespace Pustak.Models
{
    public class AdminMaster
    {
        public int AdminID { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
