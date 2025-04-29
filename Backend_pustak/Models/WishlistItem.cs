namespace Pustak.Models
{
    public class WishlistItem
    {
        public int WishlistItemId { get; set; }
        public Guid WishlistId { get; set; }
        public Wishlist Wishlist { get; set; } = null!;
        public int BookId { get; set; }

        // Add a navigation property for Book
        public Book Book { get; set; } = null!;
    }
}
