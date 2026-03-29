namespace Bookstore.API.Models;

public class CartItem
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public double Price { get; set; }
    public int Quantity { get; set; }
    public double Subtotal => Price * Quantity;
}
