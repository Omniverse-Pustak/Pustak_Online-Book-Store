using System;
using System.Collections.Generic;
namespace Pustak.Models
{
    public class CustomerOrderDetail
    {
        public int OrderDetailsId { get; set; }
        public Guid OrderId { get; set; }
        public CustomerOrder Order { get; set; } = null!;
        public int BookId { get; set; }

        // Navigation property for the related Book entity
        public Book Book { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Title { get; set; }  // Book title (redundant if Book navigation is included)
        public string Author { get; set; }  // Book author (redundant if Book navigation is included)
        public string CoverFileName { get; set; }  // Path to the cover image (redundant if Book navigation is included)
        public decimal TotalPrice { get; set; }  // Total price for this order detail
    }

}

