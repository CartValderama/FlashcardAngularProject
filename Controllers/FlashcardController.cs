using FlashcardProject.DAL;
using FlashcardProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashcardProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlashcardController : Controller
{
    private readonly IFlashcardRepository _flashcardRepository;
    private readonly ILogger<FlashcardController> _logger;
    public FlashcardController(IFlashcardRepository FlashcardRepository, ILogger<FlashcardController> logger)
    {
        _flashcardRepository = FlashcardRepository;
        _logger = logger;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var Flashcards = await _flashcardRepository.GetAll();
        if (Flashcards == null)
        {
            _logger.LogError("[FlashcardController] Flashcard list not found while executing _FlashcardRepository.GetAll().");
            return BadRequest("Flashcard list not found");
        }
        return Ok(Flashcards);
    }

    [HttpGet("bydeck/{id}")]
    public async Task<IActionResult> GetAllByDeckId(int deckId)
    {
        var Flashcards = await _flashcardRepository.GetFlashcardsByDeckId(deckId);
        if (Flashcards == null)
        {
            _logger.LogError("[FlashcardController] Flashcard list not found while executing _FlashcardRepository.GetFlashcardsByDeckId().");
            return BadRequest("Flashcard list not found");
        }
        return Ok(Flashcards);
    }


    // Crud operations

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] Flashcard newFlashcard)
    {
        if (newFlashcard == null)
        {
            return BadRequest("Invalid Flashcard data");
        }
        newFlashcard.CreationDate = DateTime.UtcNow;
        bool returnOk = await _flashcardRepository.Create(newFlashcard);

        if (returnOk)
        {
            //var response = new { success = true, message = "Flashcard created successfully" };
            // return Ok(response);
            return Ok(newFlashcard);
        }
        else
        {
            // var response = new { success = false, message = "Flashcard creation failed" };
            // return Ok(response);
            return BadRequest("Flashcard creation failed");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFlashcardbyId(int id)
    {
        var Flashcard = await _flashcardRepository.GetFlashcardById(id);
        if (Flashcard == null)
        {
            _logger.LogError("[FlashcardController] Flashcard not found while executing _FlashcardRepository.GetFlashcardbyId().");
            return BadRequest("Flashcard not found");
        }
        return Ok(Flashcard);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update([FromBody] Flashcard newFlashcard)
    {
        if (newFlashcard == null)
        {
            return BadRequest("Invalid Flashcard data");
        }
        bool returnOk = await _flashcardRepository.Update(newFlashcard);
        if (returnOk)
        {
            //var response = new { success = true, message = "Flashcard #" + newFlashcard.FlashcardId + " updated successfully" };
            // return Ok(response);
            return Ok(newFlashcard);
        }
        else
        {
            //var response = new { success = false, message = "Flashcard update failed" };
            //return Ok(response);
            return BadRequest("Flashcard update failed");
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteFlashcard(int id)
    {
        bool returnOk = await _flashcardRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[FlashcardController] Flashcard deletion failed with ID {FlashcardId:0000}", id);
            return BadRequest("Flashcard deletion failed");
        }
        var response = new { success = true, message = "Flashcard " + id.ToString() + " deleted successfully" };
        return Ok(response);
    }
}
