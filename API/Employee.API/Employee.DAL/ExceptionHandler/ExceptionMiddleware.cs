using EEmployee.DAL.ExceptionHandler;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace Employee.DAL.ExceptionHandler
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            if (context.Response.HasStarted)
            {
                _logger.LogWarning("The response has already started, unable to handle exception.");
                return;
            }

            int statusCode;
            string message;
            string errorCode = null;
            string details = null;

            if (exception is AppException appEx)
            {
                statusCode = appEx.StatusCode;
                message = appEx.Message;
                errorCode = appEx.ErrorCode;
                details = _env.IsDevelopment() ? appEx.StackTrace : null;
            }
            else
            {
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = _env.IsDevelopment() ? exception.Message : "An unexpected error occurred.";
                details = _env.IsDevelopment() ? exception.StackTrace : null;
            }

            context.Response.StatusCode = statusCode;

            var errorResponse = new
            {
                statusCode,
                message,
                errorCode,
                details
            };

            var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }

    }
}