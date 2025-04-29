using Employee.DAL;

namespace Employee.API
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEmployeeServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DAL with Connection String
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddSingleton<EmployeeDAL>(new EmployeeDAL(connectionString));

            return services;
        }
    }
}
