using Application.DTOs;
using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload-file")]
        [Authorize]
        public async Task<IActionResult> UploadFile([FromForm] UploadFileDTO uploadFileDTO)
        {
            var senderID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderID))
            {
                return Unauthorized();
            }

            var result = await _fileService.UploadFileAsync(uploadFileDTO.File, senderID, uploadFileDTO.ReceiverID);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("recent-activities")]
        [Authorize]
        public async Task<IActionResult> GetRecentActivities([FromQuery] PaginationParams paginationParams)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _fileService.GetRecentActivitiesAsync(userId, paginationParams);
            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("chat-history")]
        [Authorize]
        public async Task<IActionResult> GetChatHistory([FromQuery] ChatHistoryDTO chatHistoryDTO)
        {
            var senderID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderID))
            {
                return Unauthorized();
            }
            var result = await _fileService.GetChatHistoryAsync(
                senderID,
                chatHistoryDTO.ReceiverID,
                chatHistoryDTO.Before,
                chatHistoryDTO.PageSize);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
