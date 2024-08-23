# termii-nodejs-typescript

## Description

This is a Node.js library for the Termii API. It provides a simple way to interact with the Termii API.

## Installation

To install the library, run the following command:

```bash
npm install termii-nodejs-typescript
```

## Usage

Here is an example of how to use the library:

```typescript
import NodeTermii from 'termii-nodejs-typescript';

const termii = new NodeTermii('YOUR_API_KEY');

termii.sendSms({
  to: '2348123456789',
  message: 'Hello, World!',
  from: 'Your Sender ID',
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.error(error);
});
```

## API Reference

Documentation of the library's API and available methods.


## Examples

Code examples showcasing the library's functionality.

## Contributing

Contributions are welcome. Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

This library is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more details.
