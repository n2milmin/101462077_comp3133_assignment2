import { Component, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

const GET_EMP_QUERY = gql`
  {
    getAllEmp {
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

const SEARCH_EMP_BY_D_QUERY = gql`
  query searchEmpByD($designation: String, $department: String) {
    searchEmpByD(designation: $designation, department: $department) {
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
  mutation DeleteEmpByID($id: ID!){
    deleteEmpById(id: $id){
      id
}}`

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './employeelist.component.html',
  styleUrl: './employeelist.component.css'
})
export class EmployeelistComponent {
  employees: any[] = [];
  displayed: string[] = [
    'id',
    'name',
    'gender',
    'email',
    'designation',
    'department',
    'salary',
    'actions'
  ];
  designations: string[] = ['Admin', 'Manager', 'Developer', 'HR', 'Sales'];
  departments: string[] = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];
  filterDesignation: string = '';
  filterDepartment: string = '';
  error: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_EMP_QUERY
    })
    .valueChanges.subscribe({
      next: (result: any) => {
        this.employees = result?.data?.getAllEmp || [];
      },
      error: err => {
        this.error = 'Server error: could not fetch employees.';
        console.log(err)
      }
    })
  }

  applyFilters() {
    this.apollo.query({
      query: SEARCH_EMP_BY_D_QUERY,
      variables: {
        designation: this.filterDesignation || null,
        department: this.filterDepartment || null,
      }
    }).subscribe({
      next: (result: any) => {
        this.employees = result?.data?.searchEmpByD || [];
      },
      error: (err) => {
        this.error = 'Failed to search employees.';
        console.error(err);
      }
    });
  }
  
  resetFilters() {
    this.filterDesignation = '';
    this.filterDepartment = '';
    this.ngOnInit(); 
  }

  viewDetails(id: string) {
    this.router.navigate(['/employees', id])
  }

  updateEmployee(id: string) {
    this.router.navigate(['/employees/update', id])
  }

  addEmployee() {
    this.router.navigate(['/employees/add'])
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