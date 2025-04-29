// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Pustak.Data;
using Pustak.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using System;

namespace Pustak.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminDataAccess _adminDataAccess;
        private readonly IConfiguration _configuration;

        public AdminController(AdminDataAccess adminDataAccess, IConfiguration configuration)
        {
            _adminDataAccess = adminDataAccess;
            _configuration = configuration;
        }

        // Admin Login API
        [HttpPost("admin-login")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginRequest loginRequest)
        {
            var admin = await _adminDataAccess.GetAdminByUsernameAsync(loginRequest.Username);

            if (admin == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Verify the password using BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, admin.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid username or password");
            }

            // Generate JWT Token
            var token = GenerateJwtToken(admin);

            return Ok(new { Token = token, Role = "Admin", FirstName = admin.Username });
        }

        // Generate JWT Token
        private string GenerateJwtToken(AdminMaster admin)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, admin.Username),
                new Claim(ClaimTypes.NameIdentifier, admin.AdminID.ToString()),
                new Claim(ClaimTypes.Role, "Admin") // Add Admin role claim
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // Login Request Model
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
