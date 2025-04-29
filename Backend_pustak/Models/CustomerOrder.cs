using System;
using System.Collections.Generic;

namespace Pustak.Models
{
    public class CustomerOrder
    {
        public Guid OrderId { get; set; } = Guid.NewGuid();
        public int UserID { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public decimal CartTotal { get; set; }
        public List<CustomerOrderDetail>? Details { get; set; }
    }
}
