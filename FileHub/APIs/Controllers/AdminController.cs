using Application.DTOs;
using Application.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost("create-role")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDTO model)
        {
            var role = new IdentityRole(model.RoleName);
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return Ok(new ApiResponse<string>(true, "Role created successfully", model.RoleName));
            }
            return BadRequest(new ApiResponse<string>(false, "Role created failed", null, result.Errors.Select(e => e.Description)));
        }

        [HttpPut("update-role")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDTO model)
        {
            var role = await _roleManager.FindByNameAsync(model.RoleName);
            if (role == null)
            {
                return NotFound(new ApiResponse<string>(false, "Role not found", model.RoleName));
            }
            role.Name = model.NewRoleName;
            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {
                return Ok(new ApiResponse<string>(true, "Role updated successfully", model.NewRoleName));
            }
            return BadRequest(new ApiResponse<string>(false, "Role updated failed", null, result.Errors.Select(e => e.Description)));
        }

        [HttpDelete("delete-role")]
        public async Task<IActionResult> DeleteRole([FromBody] DeleteRoleDTO model)
        {
            var role = await _roleManager.FindByNameAsync(model.RoleName);
            if (role == null)
            {
                return NotFound(new ApiResponse<string>(false, "Role not found", model.RoleName));
            }
            var usedRole = await _userManager.GetUsersInRoleAsync(model.RoleName);
            if (usedRole != null)
            {
                return BadRequest(new ApiResponse<string>(false, "Role exists, cant be deleted", null));
            }

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                return Ok(new ApiResponse<string>(true, "Role deleted successfully", model.RoleName));
            }
            return BadRequest(new ApiResponse<string>(false, "Role deleted failed", null, result.Errors.Select(e => e.Description)));
        }
    }
}
