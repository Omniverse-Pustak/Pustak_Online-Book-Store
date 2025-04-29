using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pustak.Data;
using Pustak.Services;
using Microsoft.OpenApi.Models;
using Pustak.Controllers;  // Import your AdminController namespace

var builder = WebApplication.CreateBuilder(args);

// 1) EF Core: Connect to SQL Server using your existing OnlineBookStore schema with an increased command timeout (maximum possible value)
builder.Services.AddDbContext<OnlineBookStoreContext>(opts =>
    opts.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.CommandTimeout(int.MaxValue)  // Set command timeout to the maximum possible value
    ));

// 2) JWT Authentication setup
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ClockSkew = TimeSpan.FromMinutes(10)  // Allow a longer clock skew (10 minutes)
        };
    });

// 3) Authorization policy (Admin only)
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

// 4) Register the token service
builder.Services.AddScoped<ITokenService, TokenService>();

// 5) Register Admin Data Access Service (for Admin login functionality)
builder.Services.AddScoped<AdminDataAccess>(); // Add the AdminDataAccess service here

// 6) MVC with Newtonsoft JSON
builder.Services.AddControllers()
    .AddNewtonsoftJson(opts =>
    {
        // Ignore any reference loops
        opts.SerializerSettings.ReferenceLoopHandling
            = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// 7) Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin() // Allow any origin (replace with specific domains in production)
               .AllowAnyMethod()   // Allow any HTTP method (GET, POST, PUT, DELETE)
               .AllowAnyHeader();  // Allow any header
    });
});

// 8) Swagger/OpenAPI setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pustak API", Version = "v1" });

    // JWT Bearer scheme definition
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer <token>'"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// 9) Enable middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pustak API V1");
    c.RoutePrefix = "swagger"; // serve at http://localhost:8000/swagger/index.html
});

app.UseCors("AllowAll"); // Enable CORS middleware

app.UseAuthentication();  // Use Authentication middleware
app.UseAuthorization();   // Use Authorization middleware

// Middleware to increase server request timeouts
app.Use(async (context, next) =>
{
    context.RequestAborted = new CancellationTokenSource(TimeSpan.FromMinutes(10)).Token;  // Set request timeout to 10 minutes
    await next.Invoke();
});

// 10) Map controllers
app.MapControllers(); // Map controllers, including AdminController


app.Run();  // Start the application
