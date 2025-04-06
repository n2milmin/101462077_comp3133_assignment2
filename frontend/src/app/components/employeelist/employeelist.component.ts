import { Component, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

const GET_EMP_QUERY = gql`
  query GetAllEmployees{
    employee{
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
}}`

const DELETE_EMP_MUTATION = gql`
  mutation DeleteEmpByID(id: ID!){
    deleteEmpById(id: $id){
      id
}}`

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './employeelist.component.html',
  styleUrl: './employeelist.component.css'
})
export class EmployeelistComponent {
  private apollo = inject(Apollo);
  private router = inject(Router);

  employees: any[] = [];
  displayed: string[] = ['id', 'first_name', 'last_name', 'gender', 'email', 'designation', 'department', 'salary']

  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loading = true;
    this.apollo.watchQuery({
      query: GET_EMP_QUERY
    })
    .valueChanges.subscribe({
      next: (result: any) => {
        this.employees = result?.data?.employees || [];
      },
      error: err => {
        this.error = 'Server error: could not fetch employees.';
        console.log(err)
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  viewDetails(id: string) {
    this.router.navigate(['/employeeDetails', id])
  }

  updateEmployee(id: string) {
    this.router.navigate(['/employee/update', id])
  }

  addEmployee() {
    this.router.navigate(['/employee/add'])
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMP_MUTATION,
        variables: { id },
        refetchQueries: ['GetAllEmployees'], 
      }).subscribe({
        next: (result) => {
          console.log('Employee deleted:', result);
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        },
      });
    }
  }
  
}