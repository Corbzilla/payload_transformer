# Payload Transformer API

Transform JSON payloads by replacing specific string values.

## Getting Started

```bash
npm install
npm run build
npm start
```

## Development

```bash
npm run dev        # Development server
npm run test       # Run tests
npm run lint       # Run linting
```

## Environment Variables
| Variable               | Description      | Default     |
|-----------------------|------------------|-------------|
| PORT                  | Server port      | 5005        |
| NODE_ENV              | Environment      | development |
| RATE_LIMIT_WINDOW_MS  | Rate limit window| 900000      |
| RATE_LIMIT_MAX_REQUESTS| Max requests    | 100         |

## Project Structrue
src/
├── docs/         # Generate documentation
├── middleware/     # Express middleware
├── routes/         # Route handlers
├── utils/         # Utilities
└── validators/     # Input validation

## Docker
```bash
docker build -t payload-transformer .
docker run -p 5005:5005 payload-transformer
```

## Future Improvements
- Add business logic to services folder
  - since this way a bit of an arbitrary ask, I didn't bother extracting the main logic into a seperate folder, for a real production API, this would be done for sure
- Authentication / Authorization
  - in production we would more than likely have some sort of Auth on any exposed API
- API Versioning
  - since this was pretty arbitrary, didn't bother with versioning but a production API would require this
- Circuit breaker pattern
  - in production we more than likely wouldn't like failures to lead to other issues with the API so a circuit breaker in case of issues would be needed
- Metrics
  - production API would require some way to collect metrics on use/errors/etc.
- Performance Monitoring
  - production API would require increased obserability into performance
- CI/CD pipeline
  - production/staging/qa releases would require adding some CI/CD pipeline to the project.
  - would like to see it run some tests locally but any larger test groups should be run before deployments
- Database integration
  - integrating a db for permanent collection of data (metrics, etc)
- Caching
  - adding a caching layer for simple or repeated queries
- Compression
  - adding some compression to reduce the size of respones, especially if large responses were expected
- Load Testing
  - may be included in a CI/CD pipeline, some way to ensure that the API will hold up against different size laods
