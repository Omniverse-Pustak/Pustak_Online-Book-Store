using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pustak.Data;
using Pustak.Dtos;
using Pustak.Models;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly OnlineBookStoreContext _ctx;
    private readonly ILogger<CartController> _logger;

    public CartController(OnlineBookStoreContext ctx, ILogger<CartController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    // GET: /api/Cart/{userId}
    // GET: /api/Cart/{userId}
    [HttpGet("{userId}")]
    public async Task<ActionResult<Cart>> GetCart(int userId)
    {
        if (userId <= 0)
        {
            _logger.LogWarning("Invalid userId: {UserId}", userId);
            return BadRequest("Invalid user ID");
        }

        _logger.LogInformation($"Fetching cart for userId: {userId}");

        var cart = await _ctx.Carts
            .Include(c => c.Items) // Include CartItems
            .ThenInclude(ci => ci.Book) // Include related Book details
            .FirstOrDefaultAsync(c => c.UserID == userId);

        if (cart == null)
        {
            _logger.LogWarning($"No cart found for userId: {userId}, creating a new cart.");
            cart = new Cart { UserID = userId, Items = new List<CartItem>() };
            _ctx.Carts.Add(cart);
            await _ctx.SaveChangesAsync();
        }

        // Ensure Book details like title, author, price, and cover image are fetched along with cart
        var cartDetails = new List<object>();

        foreach (var item in cart.Items)
        {
            var book = item.Book;

            var cartItemDetails = new
            {
                item.CartItemId,
                item.Quantity,
                BookId = item.BookId,
                Title = book.Title,
                Author = book.Author,
                Price = book.Price,
                Description = book.Description,
                CoverFileName = book.CoverFileName  // Add CoverFileName
            };

            cartDetails.Add(cartItemDetails);
        }

        return Ok(new { cart.UserID, cartDetails });
    }

    // POST: /api/Cart/add
    [HttpPost("add")]
    public async Task<ActionResult> AddToCart([FromBody] CartItemDto cartItemDto)
    {
        if (cartItemDto.UserId <= 0 || cartItemDto.BookId <= 0)
        {
            return BadRequest("Invalid data.");
        }

        // Check if the cart exists for the given UserId
        var cart = await _ctx.Carts
            .Include(c => c.Items) // Include items to ensure the cart is fully loaded
            .FirstOrDefaultAsync(c => c.UserID == cartItemDto.UserId);

        // If the cart doesn't exist, create a new one
        if (cart == null)
        {
            cart = new Cart { UserID = cartItemDto.UserId, Items = new List<CartItem>() };
            _ctx.Carts.Add(cart);
            await _ctx.SaveChangesAsync();  // Save the new cart
        }

        // Check if the BookId exists in the Books table
        var book = await _ctx.Books.FindAsync(cartItemDto.BookId);
        if (book == null)
        {
            return BadRequest("Invalid Book ID.");
        }

        // Add the CartItem, ensuring the CartId is a Guid (since CartId is a Guid in Cart)
        var cartItem = new CartItem
        {
            CartId = cart.CartId,  // CartId is a Guid, so this is correct
            BookId = cartItemDto.BookId,  // BookId is an int
            Quantity = cartItemDto.Quantity
        };

        _ctx.CartItems.Add(cartItem);  // ✅ Add to the DbSet directly
        await _ctx.SaveChangesAsync();

        return Ok();
    }

    // DELETE: /api/Cart/remove/{cartItemId}
    [HttpDelete("remove/{cartItemId}")]
    public async Task<ActionResult> RemoveFromCart(int cartItemId)
    {
        var cartItem = await _ctx.CartItems.FindAsync(cartItemId);

        if (cartItem == null)
        {
            return NotFound("Cart item not found.");
        }

        _ctx.CartItems.Remove(cartItem);
        await _ctx.SaveChangesAsync();

        return Ok();
    }

    // DELETE: /api/Cart/clear/{userId}
    [HttpDelete("clear/{userId}")]
    public async Task<ActionResult> ClearCart(int userId)
    {
        var cart = await _ctx.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserID == userId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        _ctx.CartItems.RemoveRange(cart.Items);
        await _ctx.SaveChangesAsync();

        return Ok();
    }
}
