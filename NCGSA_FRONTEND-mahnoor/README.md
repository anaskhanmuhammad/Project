# Three Components Fluxgate Magnetometer Software V1.3

## Overview

This project implements a real-time data visualization and logging system for a three-component fluxgate magnetometer. It uses a combination of Node.js for server-side operations, React.js for the client-side interface, and various libraries and frameworks for data handling and presentation.

## Table of Contents

1. [Server Setup](#server-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Running the Server](#running-the-server)
2. [Client Setup](#client-setup)
   - [Prerequisites](#prerequisites-1)
   - [Installation](#installation-1)
   - [Running the Client](#running-the-client)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Usage](#usage)
   

## Server Setup

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [MySQL](https://dev.mysql.com/downloads/installer/)

### Installation

1. Clone the repository:

    ```bash
    git clone[ https://github.com/Neurocomputation-Lab-NCAI-NEDUET/NCGSA-local-software]
    cd NCGSA-local-software
    ```

2. Navigate to the server directory and install dependencies:

    ```bash
    cd server
    npm install
    ```

### Configuration

1. Create a `.env` file in the server directory and add your MySQL database credentials:

    ```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=ncgsa
    ```

2. Initialize the MySQL database and create the necessary tables. You can use the provided SQL script `database.sql`:

    ```sql
    CREATE DATABASE ncgsa;
    USE records;
    CREATE TABLE records ( ID INT AUTO_INCREMENT PRIMARY KEY, TIMESTAMP BIGINT NOT NULL, X DECIMAL(10,2) NOT NULL, Y DECIMAL(10,2) NOT NULL, Z DECIMAL(10,2) NOT NULL, TOTAL DECIMAL(10,2) NOT NULL, datetime DATETIME DEFAULT CURRENT_TIMESTAMP );
    ```

### Running the Server

Start the server:

```bash
tsc -> node app.js
```

The server will run on `http://localhost:8080`.

## Client Setup

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)

### Installation

1. Navigate to the client directory and install dependencies:

    ```bash
    cd client
    npm install
    ```

### Running the Client

Start the client:

```bash
npm run dev
```


## Features

- Real-time data visualization from a three-component fluxgate magnetometer.
- Interactive charts for data presentation using Chart.js.
- Data logging and storage in a MySQL database.
- Start and stop data logging with a single button click.
- Historical data view.
- Real-time data display using `socket.io-client`.
- Tailwind CSS for a modern and responsive UI design.

## Technologies Used

### Server Side

- **Node.js**: JavaScript runtime for server-side development.
- **SerialPort**: Node.js package for accessing serial ports.
- **MySQL**: Relational database management system for storing sensor data.

### Client Side

- **React.js**: Frontend framework for building user interfaces.
- **Chart.js**: JavaScript library for creating interactive charts.
- **Fetch API**: Browser-based API for making HTTP requests to the server.
- **socket.io-client**: Library for real-time communication with the server.
- **Tailwind CSS**: Utility-first CSS framework for designing modern web applications.

## Usage

### Viewing Live Data

The real-time data visualization component connects to the server using `socket.io-client` and updates the chart with the latest data.

### Viewing Historical Data

The historical data view fetches stored sensor data from the server using the Fetch API and displays it using Chart.js.
