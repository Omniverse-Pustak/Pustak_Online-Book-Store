using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pustak.Data;
using Pustak.Models;

namespace Pustak.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly OnlineBookStoreContext _ctx;
        private readonly ILogger<BooksController> _logger;

        public BooksController(OnlineBookStoreContext ctx, ILogger<BooksController> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        // Get all books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAll() =>
            await _ctx.Books.ToListAsync();

        // Get book by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetById(int id)
        {
            var book = await _ctx.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            _logger.LogInformation($"Fetched book: {book.Title}, {book.Author}, {book.Price}");
            return Ok(book);
        }

        // Get books by category
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Book>>> GetByCategory(string category)
        {
            var books = await _ctx.Books
                                  .Where(b => b.Category.ToLower() == category.ToLower())
                                  .ToListAsync();

            if (books.Count == 0)
            {
                return NotFound();
            }

            return Ok(books);
        }

        // Get popular books
        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<Book>>> GetPopularBooks()
        {
            var popularBooks = await _ctx.Books
                                          .Where(b => b.IsPopular) // Directly check IsPopular (true/false)
                                          .ToListAsync();

            if (popularBooks.Count == 0)
            {
                return NotFound();
            }

            return Ok(popularBooks);
        }

        // Create a new book
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Book book)
        {
            if (book == null) return BadRequest("Book cannot be null.");

            _ctx.Books.Add(book);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = book.BookID }, book);
        }

        // Bulk creation of books
        [Authorize(Roles = "Admin")]
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateBulk([FromBody] IEnumerable<Book> books)
        {
            if (books == null || !books.Any())
            {
                return BadRequest("No books supplied.");
            }

            try
            {
                _ctx.Books.AddRange(books);
                await _ctx.SaveChangesAsync();
                return Ok(books);
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"Error during bulk book creation: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Update book details
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")] // Changed to HttpPut for update
        public async Task<IActionResult> Update(int id, [FromBody] Book updated)
        {
            if (updated == null) return BadRequest("Updated book data cannot be null.");

            var book = await _ctx.Books.FindAsync(id);
            if (book == null) return NotFound();

            book.Title = updated.Title;
            book.Author = updated.Author;
            book.Category = updated.Category;
            book.Price = updated.Price;
            book.CoverFileName = updated.CoverFileName;
            book.Description = updated.Description;

            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        // Delete a book by ID
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _ctx.Books.FindAsync(id);
            if (book == null) return NotFound();

            _ctx.Books.Remove(book);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        // ⭐️ NEW API: Set Popular or Not Popular
        [Authorize(Roles = "Admin")]
        [HttpPost("setpopular")]
        public async Task<IActionResult> SetPopularStatus([FromBody] SetPopularRequest request)
        {
            if (request == null) return BadRequest("Invalid request.");

            var book = await _ctx.Books.FindAsync(request.BookId);
            if (book == null) return NotFound("Book not found.");

            // Validate the Status value
            if (string.IsNullOrEmpty(request.Status) ||
                (request.Status.ToLower() != "popular" && request.Status.ToLower() != "notpopular"))
            {
                return BadRequest("Invalid status. Use 'popular' or 'notpopular'.");
            }

            // Set IsPopular based on status
            book.IsPopular = request.Status.ToLower() == "popular";

            await _ctx.SaveChangesAsync();
            return Ok(new { message = "Book popularity updated successfully." });
        }

        // 🔥 NEW model class for the request body
        public class SetPopularRequest
        {
            public int BookId { get; set; }
            public string Status { get; set; } = "popular"; // default value
        }


        // Search books by title or ID
        [HttpGet("search/{query}")]
        public async Task<ActionResult<Book>> Search(string query)
        {
            if (int.TryParse(query, out int id))
            {
                // If query is numeric, try to find by ID
                var bookById = await _ctx.Books.FirstOrDefaultAsync(b => b.BookID == id);

                if (bookById != null)
                    return Ok(bookById);
            }

            // Else, search by Title (case insensitive)
            var bookByTitle = await _ctx.Books
     .FirstOrDefaultAsync(b => EF.Functions.Like(b.Title, $"%{query}%"));


            if (bookByTitle != null)
                return Ok(bookByTitle);

            return NotFound();
        }


        [HttpPost("search-multiple")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchMultiple([FromBody] List<string> queries)
        {
            var ids = queries.Where(q => int.TryParse(q, out _)).Select(int.Parse).ToList();
            var titles = queries.Where(q => !int.TryParse(q, out _)).ToList();

            var matchedBooks = await _ctx.Books
                .Where(b => ids.Contains(b.BookID) || titles.Any(t => b.Title.ToLower().Contains(t.ToLower())))
                .ToListAsync();

            if (matchedBooks.Count == 0)
                return NotFound();

            return Ok(matchedBooks);
        }


    }
}
