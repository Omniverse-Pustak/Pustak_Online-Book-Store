using System;

namespace Pustak.Dtos
{
    public class OrderWithBookDetailsDto
    {
        public Guid OrderId { get; set; }
        public decimal CartTotal { get; set; }
        public List<OrderDetailWithBookDto> Details { get; set; }
    }

}
