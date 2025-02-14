import {
   Injectable,
   NestInterceptor,
   ExecutionContext,
   CallHandler,
   HttpException,
   HttpStatus,
 } from '@nestjs/common';
 import { Observable } from 'rxjs';
 import { map } from 'rxjs/operators';
 
 @Injectable()
 export class ResponseInterceptor implements NestInterceptor {
   intercept(
     context: ExecutionContext,
     next: CallHandler<any>,
   ): Observable<any> {
     return next.handle().pipe(
       map((data) => {
         // If the data is an error or custom exception, handle that accordingly
         if (data instanceof HttpException) {
           return {
             statusCode: data.getStatus(),
             message: data.message,
             error: true,
           };
         }
 
         // Wrap the response data inside a "data" property
         return {
           success: true,
           data,
         };
       }),
     );
   }
 }
 