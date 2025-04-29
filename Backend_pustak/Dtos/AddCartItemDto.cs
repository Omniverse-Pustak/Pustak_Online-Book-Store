using System;

namespace Pustak.Dtos
{
    public class AddCartItemDto
    {
        public Guid CartId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
