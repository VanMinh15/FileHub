﻿using Application.DTOs;
using Application.Interfaces;
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
    }
}