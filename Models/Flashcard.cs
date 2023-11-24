using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace FlashcardProject.Models;
public class Flashcard
{
    [JsonPropertyName("FlashcardId")]
    public int FlashcardId { get; set; }

    [JsonPropertyName("Question")]
    [StringLength(90)]
    public string Question { get; set; } = string.Empty;

    [JsonPropertyName("Answer")]
    [StringLength(90)]
    public string Answer { get; set; } = string.Empty;

    [JsonPropertyName("CreationDate")]
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    public int DeckId { get; set; }
    // navigation property
    //public virtual Deck? Deck { get; set; }
}

