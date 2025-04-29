using System;
using System.Collections.Generic;

namespace Pustak.Models
{
    public class Wishlist
    {
        public Guid WishlistId { get; set; } = Guid.NewGuid();
        public int UserID { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public List<WishlistItem>? Items { get; set; }
    }
}
