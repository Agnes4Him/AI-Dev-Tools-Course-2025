* Lovabel Prompt
Build a platform for online coding interviews using React + Vite.

The app should be able to do the following:

1. Create a link and share it with candidates
2. Allow everyone who connects to edit code in the code panel
3. Show real-time updates to all connected users
4. Support syntax highlighting for multiple languages
5. Execute code safely in the browser

Make sure that all the logic is covered with tests.
Don't implement backend, so everything is mocked. But centralize all the calls to the backend in one place

* Implement later on project UI
Add real backend: Connect to Supabase for persistent sessions and real WebSocket sync
Enhance editor: Add cursor positions, participant colors, code snippets library
Prompting/Visual edits: Customize colors, add company branding, tweak layouts

* Run test prompt
I've this client application built using React + Vite. The calls to backend (which doesn't) exist yet are mocked. Analyse the code and tell me how to run the tests created, and if no test exist, you can add them.

* Create OpenAPI spec prompt
analyse the content of the client and create an OpenAPI specs based on what it needs. later we want to implement backend based on these specs

* Create backend logic prompt
based on the OpenAPI specs, create fastapi backend for now use a mock database, which we will later replace with a real one create tests to make sure the implementation works

follow the guidelines in AGENTS.md

* Integrate frontend and backend prompt
Make frontend use backend. use OpenAPI specs for guidance follow the guidelines in AGENTS.md

* Run client and backend together prompt
Now let's make it possible to run both client and server at the same time. Use `concurrently` for that

* Add support for syntax highlighting prompt
Let's now add support for syntax highlighting for JavaScript and Python

* A dd code execution logic prompt
Now let's add code execution logic.

For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser

* Database support prompt
now for backend let's use postgres and sqlite database (via sqlalchemy) follow the guidelines in AGENTS.md

* Integration testing prompt
let's also add some integration tests (using sqlite) to make sure things work put the integration test in a separate folder tests_integration

* Docker prompt
right now we have frontend, backend, and database (sqlite)

let's put everything into docker compose and use postgres there. we can serve frontend with nginx or whatever you recommend

* Deployment
For deployment we need to put together backend and frontend in one container. create a Dockerfile for the application. Put both backend and frontend in one container

let's do that

* CI/CD prompt
I want to create a CI/CD pipeline with github actions with two parts

first we run tests (frontend + backend)
if tests pass, I want to deploy the update to render
let's also run integration tests for backend separately before running deployment