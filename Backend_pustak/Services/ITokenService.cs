using Pustak.Models;

namespace Pustak.Services
{
    public interface ITokenService
    {
        string CreateToken(UserMaster user);
    }
}
