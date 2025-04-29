using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pustak.Data;  // Use the correct namespace for your OnlineBookStoreContext
using Pustak.Models; // Ensure that your AdminMaster class is in the correct namespace

namespace Pustak.Data
{
    public class AdminDataAccess
    {
        private readonly OnlineBookStoreContext _context;

        // Constructor
        public AdminDataAccess(OnlineBookStoreContext context)
        {
            _context = context;
        }

        // Method to check if admin exists by username
        public async Task<AdminMaster> GetAdminByUsernameAsync(string username)
        {
            return await _context.AdminMasters
                                 .Where(a => a.Username == username)
                                 .FirstOrDefaultAsync();
        }
    }
}
