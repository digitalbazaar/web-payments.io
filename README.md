# web-payments.io

The server-side portion of a polyfill for the [Web Payments Browser API][].

A live version and demo of this site can be found at [web-payments.io][].

This software enables a person to register payment applications that can be
used to perform payments at websites that use the [Web Payments Browser API][].

# Core Functionality

This software enables a person to:

1. Register a payment application for later use.
2. Choose a compatible, previously registered payment application following
   a payment request.
3. Proxy payment requests and payment acknowledgements between
   payee websites and payment applications.

# Development

The following section explains how to setup and develop the web-payments.io
software on a local development machine.

### Requirements

* node.js
* npm

### Configuration

The options in the `./configs/web-payments.dev.js` file can be tuned to your
environment as needed.

## Setup

* Install the dependencies (see below)
* Map the `web-payments.dev` hostname to your localhost.

To install dependencies, do the following:

    npm install

### Running

Add a host alias (for example, edit `/etc/hosts`) to map `web-payments.dev` to
`localhost`.

Run the following to start up a development server from the source directory:

    node web-payments.dev.js

To add more verbose debugging, use the `--log-level` option:

    node web-payments.dev.js --log-level debug

### Usage

Access the server at the following URL:

* https://web-payments.dev:53443/

[web-payments.io]: https://web-payments.io
[Web Payments Browser API]: http://wicg.github.io/web-payments-browser-api/
