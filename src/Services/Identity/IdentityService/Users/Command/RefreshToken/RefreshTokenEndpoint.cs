using System.Security.Claims;
using IdentityService.Dtos.UserDtos;

namespace IdentityService.Users.Command.RefreshToken
{
    public class RefreshTokenEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/refresh_token", async (HttpRequest req, ISender sender) =>
            {
                var authorizationHeader = req.Headers["Authorization"].ToString();

                if (string.IsNullOrWhiteSpace(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
                {
                    return Results.Unauthorized();
                }

                var refreshToken = authorizationHeader["Bearer ".Length..].Trim();

                var idClaim = req.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(idClaim) || !Guid.TryParse(idClaim, out var userId))
                {
                    return Results.BadRequest(new Response<UserLoginRes?>(
                        301,
                        "Invalid user ID",
                        null
                    ));
                }
                var result = await sender.Send(new RefreshTokenCommand(userId, refreshToken));

                if (result.User is null)
                    return Results.Ok(new Response<UserLoginRes>(
                        301,
                        "Refresh token failed",
                        result
                ));
                return Results.Ok(new Response<UserLoginRes>(
                        201,
                        "Refesh token success",
                        result
                ));

            }).RequireAuthorization();
        }
    }
}



