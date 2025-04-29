using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pustak.Data;
using Pustak.Dtos;
using Pustak.Models;
using Pustak.Services; // Ensure all using directives are here, at the top

namespace Pustak.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly OnlineBookStoreContext _ctx;
        private readonly ITokenService _tokenSvc;

        public AuthController(OnlineBookStoreContext ctx, ITokenService tokenSvc)
        {
            _ctx = ctx;
            _tokenSvc = tokenSvc;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(RegisterDto dto)
        {
            try
            {
                // Check if the username already exists
                if (await _ctx.Users.AnyAsync(u => u.Username == dto.Username))
                    return BadRequest("Username already exists");

                // Use FirstOrDefaultAsync to safely handle when the 'User' type is not found
                var userType = await _ctx.UserTypes
                    .FirstOrDefaultAsync(t => t.UserTypeName == "User");

                // If no UserType is found, return an appropriate error
                if (userType == null)
                {
                    return BadRequest("UserType 'User' not found.");
                }

                var user = new UserMaster
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Username = dto.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Gender = dto.Gender,
                    UserTypeID = userType.UserTypeID
                };

                // Add the user to the database
                _ctx.Users.Add(user);
                await _ctx.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception (you can replace this with actual logging if you want)
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _ctx.Users
                .Include(u => u.UserType)
                .SingleOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _tokenSvc.CreateToken(user);

            var cart = await _ctx.Carts.FirstOrDefaultAsync(c => c.UserID == user.UserID);

            return new AuthResponseDto
            {
                Token = token,
                Role = user.UserType?.UserTypeName ?? "Unknown",  // Handle null UserType
                FirstName = user.FirstName,
                UserId = user.UserID,
                CartId = cart?.CartId.ToString()  // ✅ Correct! (Guid -> string)
            };
        }




        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> Me()
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var user = await _ctx.Users
                              .Include(u => u.UserType)
                              .SingleAsync(u => u.UserID == userId);

            return new UserDto
            {
                UserID = user.UserID,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.UserType.UserTypeName
            };
        }
    }
}
