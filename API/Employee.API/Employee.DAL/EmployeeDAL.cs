using Employee.DAL.Entities;
using Employee.DAL.ExceptionHandler;
using MySql.Data.MySqlClient;
using System.Data;
namespace Employee.DAL
{
    public class EmployeeDAL
    {
        private readonly string _connectionString;

        public EmployeeDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<EmployeeResponse>> GetAllEmployeesAsync(string? name = null)
        {
            try
            {
                var employees = new List<EmployeeResponse>();
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var cmd = new MySqlCommand("spGetAllEmployees", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@p_Name", string.IsNullOrEmpty(name) ? (object)DBNull.Value : name);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    employees.Add(new EmployeeResponse
                    {
                        EmployeeId = reader.GetInt32("EmployeeId"),
                        Name = reader.GetString("Name"),
                        Designation = reader.GetString("Designation"),
                        DateOfJoin = reader.GetDateTime("DateOfJoin"),
                        Salary = reader.GetDecimal("Salary"),
                        Gender = reader.GetString("Gender"),
                        StateId = reader.GetInt32("StateId"),
                        StateName = reader.GetString("StateName"),
                        DateOfBirth = reader.GetDateTime("DateOfBirth")
                    });
                }

                if (!employees.Any())
                {
                    throw new NotFoundException("No employees found.");
                }

                return employees;
            }
            catch (MySqlException ex)
            {
                throw new BadRequestException("Database error occurred while fetching employees.", ex.Message);
            }
        }

        public async Task<List<StateEntity>> GetAllStatesAsync()
        {
            try
            {
                var states = new List<StateEntity>();
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var cmd = new MySqlCommand("spGetAllStates", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    states.Add(new StateEntity
                    {
                        StateId = reader.GetInt32("StateId"),
                        StateName = reader.GetString("StateName")
                    });
                }

                if (!states.Any())
                {
                    throw new NotFoundException("No states found.");
                }

                return states;
            }
            catch (MySqlException ex)
            {
                throw new BadRequestException("Database error occurred while fetching states.", ex.Message);
            }
        }

        public async Task AddEmployeeAsync(EmployeeEntity emp)
        {
            try
            {
                if (emp == null)
                {
                    throw new BadRequestException("Employee data is required.");
                }

                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var cmd = new MySqlCommand("spAddEmployee", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@p_Name", emp.Name);
                cmd.Parameters.AddWithValue("@p_Designation", emp.Designation);
                cmd.Parameters.AddWithValue("@p_DateOfJoin", emp.DateOfJoin);
                cmd.Parameters.AddWithValue("@p_Salary", emp.Salary);
                cmd.Parameters.AddWithValue("@p_Gender", emp.Gender);
                cmd.Parameters.AddWithValue("@p_StateId", emp.StateId);
                cmd.Parameters.AddWithValue("@p_DateOfBirth", emp.DateOfBirth);

                var result = await cmd.ExecuteNonQueryAsync();
                if (result <= 0)
                {
                    throw new Exception("Failed to add the employee. Please try again.");
                }
            }
            catch (MySqlException ex)
            {
                throw new BadRequestException("Database error occurred while adding the employee.", ex.Message);
            }
        }

        public async Task UpdateEmployeeAsync(EmployeeEntity emp)
        {
            try
            {
                if (emp == null || emp.EmployeeId <= 0)
                {
                    throw new BadRequestException("Valid employee data is required for update.");
                }

                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var cmd = new MySqlCommand("spUpdateEmployee", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@p_EmployeeId", emp.EmployeeId);
                cmd.Parameters.AddWithValue("@p_Name", emp.Name);
                cmd.Parameters.AddWithValue("@p_Designation", emp.Designation);
                cmd.Parameters.AddWithValue("@p_DateOfJoin", emp.DateOfJoin);
                cmd.Parameters.AddWithValue("@p_Salary", emp.Salary);
                cmd.Parameters.AddWithValue("@p_Gender", emp.Gender);
                cmd.Parameters.AddWithValue("@p_StateId", emp.StateId);
                cmd.Parameters.AddWithValue("@p_DateOfBirth", emp.DateOfBirth);

                var result = await cmd.ExecuteNonQueryAsync();
                if (result <= 0)
                {
                    throw new NotFoundException($"Employee with ID {emp.EmployeeId} not found.");
                }
            }
            catch (MySqlException ex)
            {
                throw new BadRequestException("Database error occurred while updating the employee.", ex.Message);
            }
        }

        public async Task DeleteMultipleEmployeesAsync(string ids)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ids))
                {
                    throw new BadRequestException("No employee IDs provided for deletion.");
                }

                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var cmd = new MySqlCommand("spDeleteMultipleEmployees", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@p_Ids", ids);

                var outputParam = new MySqlParameter("@p_Result", MySqlDbType.Int32)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(outputParam);

                await cmd.ExecuteNonQueryAsync();

                int result = (int)outputParam.Value;
                if (result == 0)
                {
                    throw new NotFoundException("No employees found to delete with the given IDs.");
                }
            }
            catch (MySqlException ex)
            {
                throw new BadRequestException("Database error occurred while deleting employees.", ex.Message);
            }
        }

    }
}
