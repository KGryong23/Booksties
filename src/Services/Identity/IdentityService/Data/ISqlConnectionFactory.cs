using System.Data;

namespace IdentityService.Data
{
    public interface ISqlConnectionFactory
    {
        IDbConnection Create();
    }
}
