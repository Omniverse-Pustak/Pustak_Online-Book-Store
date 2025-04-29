using Microsoft.EntityFrameworkCore;
using Pustak.Models;

namespace Pustak.Data
{
    public class OnlineBookStoreContext : DbContext
    {
        public OnlineBookStoreContext(DbContextOptions<OnlineBookStoreContext> opts)
            : base(opts) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<UserMaster> Users { get; set; }  // Users table mapped to UserMaster model
        public DbSet<Book> Books { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<CustomerOrder> Orders { get; set; }
        public DbSet<CustomerOrderDetail> OrderDetails { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<AdminMaster> AdminMasters { get; set; }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            // --- AdminMaster ---
            mb.Entity<AdminMaster>(eb =>
            {
                eb.ToTable("AdminMaster");  // AdminMaster table
                eb.HasKey(a => a.AdminID);
                eb.Property(a => a.PasswordHash)
                  .HasColumnName("PasswordHash")
                  .HasColumnType("varchar(100)")
                  .IsRequired();
                eb.Property(a => a.DateCreated)
                  .HasDefaultValueSql("GETUTCDATE()");
            });

            // --- UserMaster ---
            mb.Entity<UserMaster>(eb =>
            {
                eb.ToTable("UserMaster");  // UserMaster table
                eb.HasKey(u => u.UserID);  // Primary key is UserID
                eb.Property(u => u.PasswordHash)
                  .HasColumnName("PasswordHash")
                  .HasColumnType("varchar(100)")
                  .IsRequired();
            });

            // --- UserType ---
            mb.Entity<UserType>(eb =>
            {
                eb.ToTable("UserType");
                eb.HasKey(t => t.UserTypeID);
            });

            // --- Category ---
            mb.Entity<Category>(eb =>
            {
                eb.ToTable("Categories");
                eb.HasKey(c => c.CategoryID);
            });

            // --- Book ---
            mb.Entity<Book>(eb =>
            {
                eb.ToTable("Book");
                eb.HasKey(b => b.BookID);
                eb.Property(b => b.Price).HasPrecision(10, 2);  // Price precision
            });

            // --- Cart ---
            mb.Entity<Cart>(eb =>
            {
                eb.ToTable("Cart");
                eb.HasKey(c => c.CartId);
                eb.Property(c => c.CartId)
                  .HasColumnType("uniqueidentifier")
                  .IsRequired();
                eb.Property(c => c.DateCreated)
                  .HasDefaultValueSql("GETUTCDATE()");
            });

            // --- CartItem ---
            mb.Entity<CartItem>(eb =>
            {
                eb.ToTable("CartItems");
                eb.HasKey(ci => ci.CartItemId);
                eb.HasOne(ci => ci.Cart)
                  .WithMany(c => c.Items)
                  .HasForeignKey(ci => ci.CartId);


                eb.HasOne(ci => ci.Book)
         .WithMany() // Book does not have a collection of CartItems, so no 'WithMany'
         .HasForeignKey(ci => ci.BookId);
            });

            // --- CustomerOrder ---
            mb.Entity<CustomerOrder>(eb =>
            {
                eb.ToTable("CustomerOrders");
                eb.HasKey(o => o.OrderId);
                eb.Property(o => o.OrderId)
                  .HasColumnType("uniqueidentifier")
                  .IsRequired();
                eb.Property(o => o.DateCreated)
                  .HasDefaultValueSql("GETUTCDATE()");
                eb.Property(o => o.CartTotal)
                  .HasPrecision(10, 2);
            });

            // --- CustomerOrderDetail ---
            mb.Entity<CustomerOrderDetail>(eb =>
            {
                eb.ToTable("CustomerOrderDetails");
                eb.HasKey(od => od.OrderDetailsId);
                eb.HasOne(od => od.Order)
                  .WithMany(o => o.Details)
                  .HasForeignKey(od => od.OrderId);
                eb.Property(od => od.Price)
                  .HasPrecision(10, 2);
            });

            // --- Wishlist ---
            mb.Entity<Wishlist>(eb =>
            {
                eb.ToTable("Wishlist");
                eb.HasKey(w => w.WishlistId);
                eb.Property(w => w.WishlistId)
                  .HasColumnType("uniqueidentifier")
                  .IsRequired();
                eb.Property(w => w.DateCreated)
                  .HasDefaultValueSql("GETUTCDATE()");
            });

            // --- WishlistItem ---
            mb.Entity<WishlistItem>(eb =>
            {
                eb.ToTable("WishlistItems");
                eb.HasKey(wi => wi.WishlistItemId);
                eb.HasOne(wi => wi.Wishlist)
                  .WithMany(w => w.Items)
                  .HasForeignKey(wi => wi.WishlistId);
            });

            // Additional entity mappings as needed
        }
    }
}
