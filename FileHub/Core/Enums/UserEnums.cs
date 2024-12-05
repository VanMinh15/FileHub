namespace Application.Enums
{
    public class UserStatus : Enumeration
    {
        public static readonly UserStatus Active = new UserStatus(1, nameof(Active));
        public static readonly UserStatus Inactive = new UserStatus(2, "Inactive");
        public static readonly UserStatus Suspended = new UserStatus(3, "Suspended");

        private UserStatus(int id, string name) : base(id, name)
        {
        }
    }
}
