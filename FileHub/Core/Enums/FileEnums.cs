namespace Application.Enums
{
    public class FilePermission : Enumeration
    {
        public static readonly FilePermission Public = new FilePermission(1, nameof(Public));
        public static readonly FilePermission Private = new FilePermission(2, nameof(Private));

        private FilePermission(int id, string name) : base(id, name)
        {
        }
    }
}
