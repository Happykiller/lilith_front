# Lilith Planning Poker Front

Back Planning Poker is a project that leverages TypeScript, NestJS, and GraphQL subscriptions to facilitate efficient back-end planning sessions using the popular Planning Poker technique. This project aims to streamline the estimation process for development tasks, ensuring better accuracy and collaboration among team members.

## Features

- **Real-time Collaboration**: Utilize GraphQL subscriptions to enable real-time collaboration during planning sessions, allowing team members to instantly see and discuss estimations.

- **Scalable Architecture**: Built on NestJS, a powerful and extensible Node.js framework, the project provides a scalable and modular architecture for easy maintenance and future enhancements.

- **TypeScript**: Leverage the benefits of TypeScript for static typing, enhanced code readability, and improved development productivity.

## Technologies Used

- **React**: A progressive framework for building efficient, scalable, and maintainable client-side applications.

- **GraphQL**: A query language and runtime for APIs that enables efficient data fetching and real-time updates.

- **TypeScript**: A superset of JavaScript that adds static types to the language, improving code quality and development experience.

## Getting Started

### Prerequisites

- React: [Download and Install React](https://react.dev/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Happykiller/lilith_front.git
```

2. Install dependencies:

```bash
cd lilith_back
npm install
```

3. Set up environment variables:

Create a `.env` file in the project root and configure the necessary environment variables.

```env
# Sample .env file
APP_VESION="0.1.0"
APP_MODE="prod"
APP_PORT="8080"
APP_API_URL="http://localhost:3000/graphql"
APP_WS_URL="ws://localhost:3000/graphql"
APP_API_TOKEN="token"
```

4. Run the application:

```bash
npm run start
```

## MEP

* `docker build -t lilith_front -f Dockerfile .`
* `docker save lilith_front | gzip > lilith_front.tar.gz`
* `docker load < lilith_front.tar.gz`
* `docker run -d --restart=always -p 8080:80 --name lilith_front lilith_front`

## Usage

Open your browser and navigate to http://localhost:8080 (or the specified port in your .env file).

Start a new planning session, and team members can join by accessing the provided URL.

Use the Planning Poker interface to estimate each task, and the real-time updates via GraphQL subscriptions will keep everyone in sync.

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the React, GraphQL, and TypeScript communities for providing excellent tools and resources.

Happy Planning Poker! 🃏✨