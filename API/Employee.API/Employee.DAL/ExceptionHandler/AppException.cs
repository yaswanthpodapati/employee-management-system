namespace EEmployee.DAL.ExceptionHandler
{
    public class AppException : Exception
    {
        public int StatusCode { get; }
        public string ErrorCode { get; }

        public AppException(string message, int statusCode = 500, string errorCode = null, Exception innerException = null)
            : base(message, innerException)
        {
            StatusCode = statusCode;
            ErrorCode = errorCode;
        }
    }
}
