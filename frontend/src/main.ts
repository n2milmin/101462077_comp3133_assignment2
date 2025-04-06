import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const apolloOptions: ApolloClientOptions<any> = {
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
};

bootstrapApplication(AppComponent, {
  providers: [
    provideApollo(() => apolloOptions), 
    provideHttpClient(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
