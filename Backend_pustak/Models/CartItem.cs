namespace Pustak.Models
{
    public class CartItem
    {
        public int CartItemId { get; set; }
        public Guid CartId { get; set; }
        public int BookId { get; set; }  // This should be BookId, not ProductId
        public int Quantity { get; set; }

        public Book Book { get; set; }  // Navigation property to Book
        public Cart Cart { get; set; }  // Navigation property to Cart
    }

}
