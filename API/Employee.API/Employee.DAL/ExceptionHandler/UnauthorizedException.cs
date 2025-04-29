using EEmployee.DAL.ExceptionHandler;
using System.Net;

namespace Employee.DAL.ExceptionHandler
{
    public class UnauthorizedException : AppException
    {
        public UnauthorizedException(string message, string errorCode = "UNAUTHORIZED", Exception innerException = null)
            : base(message, (int)HttpStatusCode.Unauthorized, errorCode, innerException)
        {
        }
    }
}
