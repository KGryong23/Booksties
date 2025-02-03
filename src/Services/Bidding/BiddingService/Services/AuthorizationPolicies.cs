using Microsoft.AspNetCore.Authorization;

namespace BiddingService.Services
{
    public static class AuthorizationPolicies
    {
        public static void AddPolicies(AuthorizationOptions options)
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("Permission_ViewUsers", policy =>
                policy.Requirements.Add(new PermissionRequirement("view_users")));
            options.AddPolicy("Permission_CreateUser", policy =>
                policy.Requirements.Add(new PermissionRequirement("create_user")));
            options.AddPolicy("Permission_UpdateUser", policy =>
                policy.Requirements.Add(new PermissionRequirement("update_user")));
            options.AddPolicy("Permission_DeleteUser", policy =>
                policy.Requirements.Add(new PermissionRequirement("delete_user")));
        }
    }
}
