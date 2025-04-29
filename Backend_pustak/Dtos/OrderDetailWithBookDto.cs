using System;

namespace Pustak.Dtos
{
    public class OrderDetailWithBookDto
    {
        public int OrderDetailsId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int BookId { get; set; }
        public string Title { get; set; } // Book Title
        public string Author { get; set; } // Book Author
        public string CoverFileName { get; set; } // Book Cover File Path
        public decimal TotalPrice { get; set; } // Total Price for this order detail
    }
}
