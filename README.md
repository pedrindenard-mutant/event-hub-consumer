# Azure Event Hub Consumer (TypeScript)

## Overview

This repository contains a minimal TypeScript application that connects to an Azure Event Hub, subscribes to incoming events, logs event details, and updates checkpoints. It uses the official Azure SDK for Event Hubs and dotenv for configuration management.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Code Structure](#code-structure)
- [Graceful Shutdown](#graceful-shutdown)
- [License](#license)

---

## Prerequisites

Before you begin, ensure that you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually installed alongside Node.js)
- An active Azure subscription with an Event Hub namespace and an existing Event Hub instance
- Credentials (connection string, event hub name, consumer group name)

---

## Environment Variables

This application reads configuration values from a `.env` file located in the project root. Create a file named `.env` and provide the following variables:

```dotenv
CONSUMER_GROUP=<Your Event Hub Consumer Group Name>
CONSUMER_CONNECTION=<Your Event Hub Connection String>
CONSUMER_NAME=<Your Event Hub Name>
````

* `CONSUMER_GROUP`: The name of the Event Hub consumer group (e.g., `$Default` or a custom group you created).
* `CONSUMER_CONNECTION`: The connection string to your Event Hub namespace (e.g., `Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<keyName>;SharedAccessKey=<keyValue>`).
* `CONSUMER_NAME`: The specific Event Hub (hub) within the namespace you wish to connect to.

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pedrindenard-mutant/event-hub-consumer.git
   cd event-hub-consumer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Compile TypeScript (optional)**
   If you prefer to compile TypeScript before running:

   ```bash
   npm run build
   ```

   Otherwise, you can run directly with `ts-node` (see [Usage](#usage)).

---

## Configuration

1. **Create the `.env` file** (shown above) in the project root.
2. **Verify your Event Hub settings** in the Azure Portal:

   * Confirm your Event Hub namespace connection string.
   * Confirm the Event Hub name exists.
   * Confirm the consumer group name (default is usually `$Default`).

---

## Usage

### Run via ts-node (development)

If you have `ts-node` installed globally (or use `npx`), you can start the consumer without compiling:

```bash
npx ts-node src/index.ts
```

Or use the scripts inside `package.json`:

```json
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "npx tsc",
    "dev": "nodemon"
  }
}
```

Then run:

```bash
npm run start
```

or

```bash
npm run dev
```

### Run after TypeScript compilation (production)

1. **Compile to JavaScript**

   ```bash
   npm run build
   ```

   This emits compiled files into the `build/` directory.

2. **Execute the compiled code**

   ```bash
   node build/index.js
   ```

---

## Code Structure

```
.
├── src
│   ├── index.ts       # Application entry point
│   ├── config.ts      # Loads and exports environment variables
│   └── consumer.ts    # Defines the Consumer class to process Event Hub messages
│   └── utils.ts       # Function to generate formatted timestamp
├── .env               # Environment variable definitions (not committed)
├── package.json       # npm configuration and scripts
├── tsconfig.json      # TypeScript compiler settings
└── README.md          # This file
```

---

## Log Output

Below is a sample console output illustrating how incoming events are logged. Assume that two events with simple payloads arrive on partition 0:

```
[06/06/25 - 14:38:07] Partition "0": received 2 event(s).
[06/06/25 - 14:38:07] Event received:
    {
        "id": "a1b2c3",
        "message": "UserSignedUp",
        "details": {
            "username": "jdoe",
            "email": "jdoe@example.com"
        }
    }
[06/06/25 - 14:38:07] Event received:
    {
        "id": "d4e5f6",
        "message": "OrderCreated",
        "details": {
            "orderId": "ORD12345",
            "amount": 79.99,
            "currency": "USD"
        }
    }
```

- The first line shows a timestamp, the partition ID, and how many events were received.
- Each subsequent block shows the timestamp and the full JSON body of an event (pretty-printed with 4-space indentation).

---

## Graceful Shutdown

* The application listens for `SIGINT` (Ctrl+C) and `SIGTERM` signals.
* On receiving either signal, it calls `shutdown()`, which triggers `process.exit(0)`.

---

## Troubleshooting

* **Missing Environment Variables**
  If any of the required variables (`CONSUMER_GROUP`, `CONSUMER_CONNECTION`, `CONSUMER_NAME`) are not set or empty, the client may fail to connect. Ensure the `.env` file is present in the project root and contains valid values.

* **Permissions/Network Issues**

  * Make sure the connection string has the correct permissions (typically “Listen” or “Manage”).
  * If running behind a corporate firewall or VPN, ensure outbound connectivity to Azure Event Hubs (port 5671 for AMQP or 443 for AMQP over WebSockets) is allowed.

* **Checkpoint Failures**
  If you see errors when calling `updateCheckpoint`, verify that the consumer has permissions to write to the default Azure Storage (if you're using built-in Azure checkpoint store) or that your application isn’t prematurely shutting down before checkpoints complete.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```