using Microsoft.AspNetCore.Authorization;

namespace AuctionService.Services
{
    public static class AuthorizationPolicies
    {
        public static void AddPolicies(AuthorizationOptions options)
        {
            // options.AddPolicy("cancel_auction", policy => policy.RequireRole("Admin"));
            options.AddPolicy("cancel_auction", policy =>
                policy.Requirements.Add(new PermissionRequirement("cancel_auction")));
            options.AddPolicy("create_auction", policy =>
                policy.Requirements.Add(new PermissionRequirement("create_auction")));
            options.AddPolicy("delete_auction", policy =>
                policy.Requirements.Add(new PermissionRequirement("delete_auction")));
            options.AddPolicy("end_auction", policy =>
                policy.Requirements.Add(new PermissionRequirement("end_auction")));
            options.AddPolicy("update_auction_end", policy =>
                policy.Requirements.Add(new PermissionRequirement("update_auction_end")));
            options.AddPolicy("update_auction_status", policy =>
                policy.Requirements.Add(new PermissionRequirement("update_auction_status")));
            options.AddPolicy("view_auctions", policy =>
                policy.Requirements.Add(new PermissionRequirement("view_auctions")));
        }
    }
}
