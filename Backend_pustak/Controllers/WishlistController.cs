using Microsoft.AspNetCore.Mvc;
using Pustak.Models;
using Pustak.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Pustak.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly OnlineBookStoreContext _context;

        public WishlistController(OnlineBookStoreContext context)
        {
            _context = context;
        }

        // 1. Add a book to the wishlist
        [HttpPost("add")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistItemRequest wishlistItemRequest)
        {
            if (wishlistItemRequest == null)
            {
                return BadRequest("Wishlist item cannot be null.");
            }

            // Check if the WishlistId is in Guid format, if not try parsing it
            if (wishlistItemRequest.WishlistId == Guid.Empty)
            {
                return BadRequest("Invalid Wishlist ID.");
            }

            // Check if the book is already in the user's wishlist
            var existingItem = await _context.WishlistItems
                .Where(item => item.WishlistId == wishlistItemRequest.WishlistId && item.BookId == wishlistItemRequest.BookId)
                .FirstOrDefaultAsync();

            if (existingItem != null)
            {
                return BadRequest("This book is already in the wishlist.");
            }

            // Create a new wishlist item
            var wishlistItem = new WishlistItem
            {
                WishlistId = wishlistItemRequest.WishlistId, // Use the correct WishlistId type (Guid)
                BookId = wishlistItemRequest.BookId
            };

            // Add the item to the wishlist
            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok("Book added to wishlist.");
        }

        // 2. Get all items in the wishlist
        [HttpGet("{wishlistId}")]
        public async Task<IActionResult> GetWishlistItems(Guid wishlistId)  // Ensure wishlistId is Guid here
        {
            var wishlistItems = await _context.WishlistItems
                .Where(item => item.WishlistId == wishlistId)
                .Include(item => item.Book)  // This line ensures the Book entity is included in the query
                .Select(item => new
                {
                    item.WishlistItemId,
                    item.BookId,
                    Book = new
                    {
                        item.Book.BookID,
                        item.Book.Title,
                        item.Book.Author,
                        item.Book.Price,
                        item.Book.CoverFileName,
                        item.Book.Description
                    }
                })
                .ToListAsync();

            if (wishlistItems == null || wishlistItems.Count == 0)
            {
                return NotFound("No items found in the wishlist.");
            }

            return Ok(wishlistItems);
        }

        // 3. Remove a book from the wishlist
        [HttpDelete("remove/{wishlistItemId}")]
        public async Task<IActionResult> RemoveFromWishlist(int wishlistItemId)
        {
            var wishlistItem = await _context.WishlistItems.FindAsync(wishlistItemId);

            if (wishlistItem == null)
            {
                return NotFound("Item not found in the wishlist.");
            }

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok("Item removed from wishlist.");
        }

        // 4. Create a new wishlist for a user
        [HttpPost("create")]
        public async Task<IActionResult> CreateWishlist([FromBody] Wishlist wishlist)
        {
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return Ok("Wishlist created.");
        }
    }

    // This is the request model for the AddToWishlist method
    public class WishlistItemRequest
    {
        public Guid WishlistId { get; set; }  // Change WishlistId to Guid
        public int BookId { get; set; }
    }
}
