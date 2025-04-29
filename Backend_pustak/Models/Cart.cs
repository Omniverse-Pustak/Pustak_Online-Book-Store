using System;
using System.Collections.Generic;

namespace Pustak.Models
{
    public class Cart
    {
        public Guid CartId { get; set; } = Guid.NewGuid();
        public int UserID { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public List<CartItem>? Items { get; set; }
    }
}
