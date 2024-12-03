using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromQuery] string email, [FromQuery] string password)
        {

            var result = await _userService.Register(email, password);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetUserByName(string username)
        {
            var user = await _userService.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] ApplicationUser user)
        {
            var result = await _userService.UpdateUserAsync(user);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromQuery] string username, [FromQuery] string password, [FromQuery] bool isPersistent, [FromQuery] bool lockoutOnFailure)
        {
            var result = await _userService.PasswordSignInAsync(username, password, isPersistent, lockoutOnFailure);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return Unauthorized(result);
        }

        [HttpPost("signout")]
        public async Task<IActionResult> SignOut()
        {
            await _userService.SignOutAsync();
            return Ok();
        }
    }
}

