using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pustak.Data;
using Pustak.Dtos;
using Pustak.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OnlineBookStoreContext _ctx;
    public OrdersController(OnlineBookStoreContext ctx) => _ctx = ctx;

    // POST: /api/Orders/place
    [HttpPost("place")]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
    {
        // Validate the incoming request
        if (dto == null || dto.Items == null || !dto.Items.Any())
            return BadRequest("Cart items are required.");

        // Fetch the cart for the given user ID
        var cart = await _ctx.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserID == dto.UserId);

        if (cart == null || cart.Items == null || !cart.Items.Any())
            return BadRequest("Cart is empty");

        decimal total = 0;

        // Loop through each item in the order and calculate the total price
        foreach (var ci in dto.Items)
        {
            var book = await _ctx.Books.FindAsync(ci.BookId);
            if (book == null)
            {
                return BadRequest($"Book with ID {ci.BookId} not found.");
            }

            // Calculate the total price for this item
            decimal itemTotalPrice = (book?.Price ?? 0m) * ci.Quantity;
            total += itemTotalPrice;
        }

        // Create a new order and save it
        var order = new CustomerOrder
        {
            UserID = dto.UserId,
            CartTotal = total
        };
        _ctx.Orders.Add(order);
        await _ctx.SaveChangesAsync();

        // Add details for each item in the order
        foreach (var ci in dto.Items)
        {
            var book = await _ctx.Books.FindAsync(ci.BookId);
            if (book == null)
            {
                return BadRequest($"Book with ID {ci.BookId} not found.");
            }

            // Calculate the total price for this item
            decimal itemTotalPrice = (book?.Price ?? 0m) * ci.Quantity;

            // Create a new CustomerOrderDetail for each item
            _ctx.OrderDetails.Add(new CustomerOrderDetail
            {
                OrderId = order.OrderId,
                BookId = ci.BookId,
                Quantity = ci.Quantity,
                Price = book?.Price ?? 0m,
                Title = book?.Title,           // Add book title
                Author = book?.Author,         // Add book author
                CoverFileName = book?.CoverFileName, // Add cover filename
                TotalPrice = itemTotalPrice    // Store the total price per item
            });
        }

        // Remove cart items after the order is placed
        _ctx.CartItems.RemoveRange(cart.Items);
        await _ctx.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHistory), new { userId = dto.UserId }, order);
    }

    // GET: /api/Orders/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<OrderWithBookDetailsDto>>> GetHistory(int userId)
    {
        var history = await _ctx.Orders
            .Where(o => o.UserID == userId)
            .Include(o => o.Details)  // Include OrderDetails
                .ThenInclude(od => od.Book)  // Include the Book entity for each OrderDetail
            .ToListAsync();

        var orderDtos = history.Select(order => new OrderWithBookDetailsDto
        {
            OrderId = order.OrderId,
            CartTotal = order.CartTotal,
            Details = order.Details.Select(detail => new OrderDetailWithBookDto
            {
                OrderDetailsId = detail.OrderDetailsId,
                Quantity = detail.Quantity,
                Price = detail.Price,
                BookId = detail.BookId,
                Title = detail.Book.Title,
                Author = detail.Book.Author,
                CoverFileName = detail.Book.CoverFileName,
                TotalPrice = detail.Quantity * detail.Price
            }).ToList()
        }).ToList();

        return Ok(orderDtos);
    }

    // Get the total count of orders for Admin role
    [Authorize(Roles = "Admin")]
    [HttpGet("count")]
    public async Task<ActionResult<int>> GetOrdersCount()
    {
        var total = await _ctx.Orders.CountAsync();
        return Ok(total);
    }
}
