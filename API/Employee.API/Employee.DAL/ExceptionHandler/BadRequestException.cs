using EEmployee.DAL.ExceptionHandler;
using System.Net;

namespace Employee.DAL.ExceptionHandler
{
    public class BadRequestException : AppException
    {
        public BadRequestException(string message, string errorCode = "BAD_REQUEST", Exception innerException = null)
            : base(message, (int)HttpStatusCode.BadRequest, errorCode, innerException)
        {
        }
    }
}
