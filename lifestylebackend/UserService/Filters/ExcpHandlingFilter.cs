using Microsoft.AspNetCore.Mvc.Filters;

namespace UserService.Filters
{
    public class ExcpHandlingFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is IndexOutOfRangeException)
                Console.WriteLine("Index out of bounds:" + context.Exception.Message);
            else
                Console.WriteLine(context.Exception.Message);
        }
    }
}
