export default class WoError extends Error {
  constructor(message, data) {
    super(message);
    this.name = "WoError";
    this.data = data;
  }
}
