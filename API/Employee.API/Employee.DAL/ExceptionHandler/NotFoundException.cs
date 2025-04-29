using EEmployee.DAL.ExceptionHandler;
using System.Net;

namespace Employee.DAL.ExceptionHandler
{
    public class NotFoundException : AppException
    {
        public NotFoundException(string message, string errorCode = "NOT_FOUND", Exception innerException = null)
            : base(message, (int)HttpStatusCode.NotFound, errorCode, innerException)
        {
        }
    }
}
