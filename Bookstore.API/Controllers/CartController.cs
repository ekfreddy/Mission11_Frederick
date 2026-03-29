using Bookstore.API.Data;
using Bookstore.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers;

[ApiController]
[Route("[controller]")]
public class CartController : ControllerBase
{
    private readonly BookstoreContext _context;
    private const string CartSessionKey = "Cart";

    public CartController(BookstoreContext context)
    {
        _context = context;
    }

    private List<CartItem> GetCart()
    {
        var cartJson = HttpContext.Session.GetString(CartSessionKey);
        if (string.IsNullOrEmpty(cartJson))
            return new List<CartItem>();
        return System.Text.Json.JsonSerializer.Deserialize<List<CartItem>>(cartJson) ?? new List<CartItem>();
    }

    private void SaveCart(List<CartItem> cart)
    {
        HttpContext.Session.SetString(CartSessionKey, System.Text.Json.JsonSerializer.Serialize(cart));
    }

    [HttpGet]
    public IActionResult GetCartItems()
    {
        var cart = GetCart();
        var total = cart.Sum(i => i.Subtotal);
        return Ok(new { Items = cart, Total = total });
    }

    [HttpPost("add/{bookId}")]
    public async Task<IActionResult> AddToCart(int bookId)
    {
        var book = await _context.Books.FindAsync(bookId);
        if (book == null) return NotFound();
        var cart = GetCart();
        var existing = cart.FirstOrDefault(i => i.BookId == bookId);
        if (existing != null)
            existing.Quantity++;
        else
            cart.Add(new CartItem { BookId = book.BookId, Title = book.Title, Author = book.Author, Price = book.Price, Quantity = 1 });
        SaveCart(cart);
        var total = cart.Sum(i => i.Subtotal);
        return Ok(new { Items = cart, Total = total });
    }

    [HttpDelete("remove/{bookId}")]
    public IActionResult RemoveFromCart(int bookId)
    {
        var cart = GetCart();
        var item = cart.FirstOrDefault(i => i.BookId == bookId);
        if (item != null) cart.Remove(item);
        SaveCart(cart);
        var total = cart.Sum(i => i.Subtotal);
        return Ok(new { Items = cart, Total = total });
    }

    [HttpDelete("clear")]
    public IActionResult ClearCart()
    {
        SaveCart(new List<CartItem>());
        return Ok(new { Items = new List<CartItem>(), Total = 0 });
    }
}
