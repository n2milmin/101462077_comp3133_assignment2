import { Component, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const LOGIN_MUTATION = gql`
  mutatuion Login($email: String, $password: String!) {
    login(email: $email, password: $password) {
      token
}}`

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private form = inject(FormBuilder);
  private apollo = inject(Apollo);
  private router = inject(Router);
  
  loading = false;
  error: string | null = null;

  loginForm = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
  
    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password}
    })
    .subscribe({
      next: (result: any) => {
        const token = result?.data?.login?.token;
        if(token){
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        } else {
          this.error = 'Server error, please try again.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Login failed, please try again.'
        console.log(err);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }


}
