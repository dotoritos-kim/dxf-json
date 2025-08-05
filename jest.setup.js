global.console = {
  ...console,
  // disable warning
  warn: jest.fn(),
}