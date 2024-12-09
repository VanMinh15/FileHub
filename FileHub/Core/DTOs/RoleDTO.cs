using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CreateRoleDTO
    {
        [Required] //runtime validation from client-side
        public required string RoleName { get; set; } //compile validation when intialize object
    }

    public class UpdateRoleDTO
    {
        [Required]
        public required string RoleName { get; set; }
        [Required]
        public required string NewRoleName { get; set; }
    }

    public class DeleteRoleDTO
    {
        [Required]
        public required string RoleName { get; set; }
    }
}
