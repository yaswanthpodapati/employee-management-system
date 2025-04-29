using Employee.DAL;
using Employee.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Employee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDAL _employeeDAL;

        public EmployeeController(EmployeeDAL employeeDAL)
        {
            _employeeDAL = employeeDAL;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string? name)
        {
            var employees = await _employeeDAL.GetAllEmployeesAsync(name);
            return Ok(employees);
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetStates()
        {
            var states = await _employeeDAL.GetAllStatesAsync();
            return Ok(states);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EmployeeEntity employee)
        {
            await _employeeDAL.AddEmployeeAsync(employee);
            return Ok(new { message = "Employee added successfully" });
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] EmployeeEntity employee)
        {
            await _employeeDAL.UpdateEmployeeAsync(employee);
            return Ok(new { message = "Employee updated successfully" });
        }

        [HttpPost("deleteMultiple")]
        public async Task<IActionResult> DeleteMultiple([FromBody] EmployeesMultipleDelete employeesMultipleDelete)
        {
            if (employeesMultipleDelete.Id == null || employeesMultipleDelete.Id.Count == 0)
                return BadRequest("No employee IDs provided.");

            string idsString = string.Join(",", employeesMultipleDelete.Id);
            await _employeeDAL.DeleteMultipleEmployeesAsync(idsString);

            return Ok(new { message = "Employees deleted successfully!" });
        }

    }
}
