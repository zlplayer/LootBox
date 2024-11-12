using LootBox.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Middleware
{
    public class ErrorHandingMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next.Invoke(context);
            }
            catch(BadRequestException badReqest)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync(badReqest.Message);
            }
            catch(NotFoundException notFound)
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync(notFound.Message);
            }
            catch(ForbiddenException forbidden)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync(forbidden.Message);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync(ex.Message);
            }
        }
    }
}
