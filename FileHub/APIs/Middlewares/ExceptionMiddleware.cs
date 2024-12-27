using Application.Models;
using System.Net;

namespace APIs.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                var request = httpContext.Request;
                _logger.LogError(ex, "An unhandled exception occurred while processing the request: {Method} {Url}", request.Method, request.Path);
                await HandleExceptionAsync(httpContext, ex);
            }
        }


        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new ApiResponse<string>(
                success: false,
                message: "An unexpected error occurred!!",
                data: null,
                errors: new[] { exception.Message }
            );

            return context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    }
}
