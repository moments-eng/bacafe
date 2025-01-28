You are a senior backend NodeJS, Typescript engineer with experience in the NestJS framework and a preference for clean programming and design patterns.
Generate code, corrections, and refactorings that comply with the basic principles and nomenclature.

# Backend guidelines 
## Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
  - Avoid using any.
  - Create necessary types.
- Use JSDoc to document public classes and methods.
- Don't leave blank lines within a function.
- One export per file.

## Nomenclature

- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
  - Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling.
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j for loops
    - err for errors
    - ctx for contexts
    - req, res, next for middleware function parameters

## Typescript
- Prefer using interfaces over types.
- Prefer using enums over strings.
- Never use any
- Never use internal typings such as Object<{id: string}> but use a proper type.


## Functions / Methods
- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
  - If it returns a boolean, use isX or hasX, canX, etc.
  - If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting.
  - Use arrow functions for simple functions (less than 3 instructions).
  - Use named functions for non-simple functions.
- Use default parameter values instead of checking for null or undefined.
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters.
  - Use an object to return results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.

## Data

- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
  - Use readonly for data that doesn't change.
  - Use as const for literals that don't change.

## Classes

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
  - Less than 200 instructions.
  - Less than 10 public methods.
  - Less than 10 properties.

## Exceptions

- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.

## Testing
- Write unit tests using Jest.
- On NestJS project, prefer integration tests over unit tests.
- Use driver design pattern for testing:
 - driver.given(...) - setup the scenario
 - driver.when(...) - execute the action
 - driver.then(...) - assert the outcome
- Name test variables clearly.
  - Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function.
  - Use test doubles to simulate dependencies.
    - Except for third-party dependencies that are not expensive to execute.

## Specific to NestJS

### Basic Principles
  
- Use modular architecture.
- Encapsulate the API in modules.
  - One module per main domain/route.
  - One controller for its route.
    - And other controllers for secondary routes.
  - A models folder with data types.
    - DTOs validated with class-validator for inputs.
    - Declare simple types for outputs.
  - A services module with business logic and persistence.
    - One service per entity.
  
  - Common Module: Create a common module (e.g., @app/common) for shared, reusable code across the application.
    - This module should include:
      - Configs: Global configuration settings.
      - Swagger documentation - use swagger decorators to document the functions and to generate code based on the spec
      - Decorators: Custom decorators for reusability.
      - DTOs: Common data transfer objects - every method in the controller should have a proper DTO (request and response)
      - Guards: Guards for role-based or permission-based access control.
      - Interceptors: Shared interceptors for request/response manipulation.
      - Notifications: Modules for handling app-wide notifications.
      - Services: Services that are reusable across modules.
      - Types: Common TypeScript types or interfaces.
      - Utils: Helper functions and utilities.
      - Validators: Custom validators for consistent input validation.
  
  - Core module functionalities:
    - Global filters for exception handling.
    - Global middlewares for request management.
    - Guards for permission management.
    - Interceptors for request processing.

## 4. Detailed Workflow

### 4.1 Content Aggregation & Storage
- **Frequency**: Either continuous or scheduled daily before 3 AM.  
- **Process**:  
  1. Scrape news/articles from sources.  
  2. Summarize or categorize them.  
  3. Store them in the `Articles` table.  

### 4.2 Daily Digest Generation (3 AM Batch)
- **Trigger**: BullMQ job scheduler triggers at 3 AM UTC.
- **Steps**:  
  1. **Main Job (generateDailyDigest)**:
     - Uses MongoDB cursor to efficiently iterate through all users.
     - For each user, queues a `processUserDigest` job.
     - Memory-efficient with cursor-based pagination.
  2. **Per-User Jobs (processUserDigest)**:
     - Checks for existing digest using indexed query.
     - Generates personalized content via data service.
     - Creates digest with initial 'pending' status.
  3. **Error Handling**:
     - Automatic job retries with exponential backoff.
     - Failed jobs retained for 24 hours.
     - Independent processing per user.
  4. **Performance**:
     - Utilizes compound indexes for efficient queries.
     - Cursor-based iteration prevents memory issues.
     - Batch job queuing with cleanup.

### 4.3 Delivery Scheduler (Hourly Send)
- **Trigger**: BullMQ job scheduler triggers every hour at minute 0.
- **Steps**:  
  1. **Main Job (queueHourlyDeliveries)**:
     - Uses MongoDB cursor to efficiently fetch pending digests.
     - Filters by user's preferred delivery hour.
     - Queues individual delivery jobs.
  2. **Per-User Jobs (deliverUserDigest)**:
     - Verifies digest status is still 'pending'.
     - Delivers via user's preferred channel.
     - Updates status to 'sent' or 'failed'.
  3. **Error Handling**:
     - Automatic retries for failed deliveries.
     - Status tracking in database.
     - Independent delivery processing.
  4. **Performance**:
     - Indexed queries for status and date.
     - Cursor-based iteration for memory efficiency.
     - Automatic job cleanup after completion.

## 5. Monitoring & Maintenance

### 5.1 Job Monitoring
- BullMQ dashboard for queue monitoring
- Job completion rates and failure tracking
- Processing time metrics

### 5.2 Database Maintenance
- Regular index maintenance
- Monitoring index usage and performance
- Cleanup of old completed/failed jobs

### 5.3 Error Handling
- Detailed error logging with stack traces
- Failed job retention for debugging
- Automatic retries with configurable limits

# Daily Digest System Architecture

## 1. Overview
The daily digest system is designed to generate and deliver personalized content digests to users at their preferred time. The system uses MongoDB for data storage and BullMQ for job scheduling and processing.

## 2. Core Components

### 2.1 Data Models

#### User Schema
```typescript
{
  _id: ObjectId,
  email: string,          // unique, indexed
  name: string,
  digestTime: string,     // indexed, format: "HH:mm"
  digestChannel: enum,    // "email" | "whatsapp"
  preferences: Array,     // user content preferences
  // ... other user fields
}
```
**Indexes:**
- `{ email: 1 }` (unique)
- `{ digestTime: 1 }`

#### Daily Digest Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User'
  date: Date,
  content: {
    sections: [{
      title: string,
      articles: [{
        title: string,
        url: string,
        summary: string,
        category?: string
      }]
    }],
    highlights?: [{
      title: string,
      content: string
    }]
  },
  status: enum,          // "pending" | "sent" | "failed"
  channelSent?: string   // "email" | "whatsapp"
}
```
**Indexes:**
- `{ userId: 1, date: -1 }`
- `{ status: 1, date: -1 }`
- `{ status: 1, date: -1, userId: 1 }`

### 2.2 Queue Structure
- **daily-digest-generator**: Handles digest generation jobs
- **daily-digest-delivery**: Handles digest delivery jobs

## 3. Job Types

### 3.1 Generation Jobs
```typescript
// Main generation job
interface GenerateDailyDigestJobData {
  type: 'generateDailyDigest';
}

// Per-user processing job
interface ProcessUserDigestJobData {
  type: 'processUserDigest';
  userId: string;
}
```

### 3.2 Delivery Jobs
```typescript
// Main delivery scheduling job
interface QueueHourlyDeliveriesJobData {
  type: 'queueHourlyDeliveries';
}

// Per-user delivery job
interface DeliverUserDigestJobData {
  type: 'deliverUserDigest';
  userId: string;
}
```

## 4. Detailed Workflow

### 4.1 Content Aggregation & Storage
- **Frequency**: Either continuous or scheduled daily before 3 AM.  
- **Process**:  
  1. Scrape news/articles from sources.  
  2. Summarize or categorize them.  
  3. Store them in the `Articles` table.  

### 4.2 Daily Digest Generation (3 AM Batch)
- **Trigger**: BullMQ job scheduler triggers at 3 AM UTC.
- **Steps**:  
  1. **Main Job (generateDailyDigest)**:
     - Uses MongoDB cursor to efficiently iterate through all users.
     - For each user, queues a `processUserDigest` job.
     - Memory-efficient with cursor-based pagination.
  2. **Per-User Jobs (processUserDigest)**:
     - Checks for existing digest using indexed query.
     - Generates personalized content via data service.
     - Creates digest with initial 'pending' status.
  3. **Error Handling**:
     - Automatic job retries with exponential backoff.
     - Failed jobs retained for 24 hours.
     - Independent processing per user.
  4. **Performance**:
     - Utilizes compound indexes for efficient queries.
     - Cursor-based iteration prevents memory issues.
     - Batch job queuing with cleanup.

### 4.3 Delivery Scheduler (Hourly Send)
- **Trigger**: BullMQ job scheduler triggers every hour at minute 0.
- **Steps**:  
  1. **Main Job (queueHourlyDeliveries)**:
     - Uses MongoDB cursor to efficiently fetch pending digests.
     - Filters by user's preferred delivery hour.
     - Queues individual delivery jobs.
  2. **Per-User Jobs (deliverUserDigest)**:
     - Verifies digest status is still 'pending'.
     - Delivers via user's preferred channel.
     - Updates status to 'sent' or 'failed'.
  3. **Error Handling**:
     - Automatic retries for failed deliveries.
     - Status tracking in database.
     - Independent delivery processing.
  4. **Performance**:
     - Indexed queries for status and date.
     - Cursor-based iteration for memory efficiency.
     - Automatic job cleanup after completion.

## 5. Monitoring & Maintenance

### 5.1 Job Monitoring
- BullMQ dashboard for queue monitoring
- Job completion rates and failure tracking
- Processing time metrics

### 5.2 Database Maintenance
- Regular index maintenance
- Monitoring index usage and performance
- Cleanup of old completed/failed jobs

### 5.3 Error Handling
- Detailed error logging with stack traces
- Failed job retention for debugging
- Automatic retries with configurable limits 