namespace Pustak.Dtos
{
	public class CartItemDto
	{
		public int UserId { get; set; }
		public int BookId { get; set; }  // Changed from ProductId to BookId
		public int Quantity { get; set; }
	}
}
