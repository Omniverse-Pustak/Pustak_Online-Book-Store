namespace Pustak.Models
{
    public class Book
    {
        public int BookID { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Category { get; set; } = null!;
        public decimal Price { get; set; }
        public string? CoverFileName { get; set; }
        public string? Description { get; set; }  // Add Description property
        public bool IsPopular { get; set; }
    }
}
