namespace Employee.DAL.Entities
{
    public class EmployeeResponse
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public DateTime DateOfJoin { get; set; }
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public int StateId { get; set; }
        public string StateName { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
