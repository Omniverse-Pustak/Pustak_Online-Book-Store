namespace Pustak.Dtos
{
    public class PlaceOrderDto
    {
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    }

    
}
