const { Transform } = require("stream");

class Adapter extends Transform {
  constructor({ shape }) {
    super({ objectMode: true });
    this.shape = shape;
  }

  _transform(chunk, encoding, callback) {
    this.push(this.shape?.(chunk) ?? chunk);
    callback();
  }
}

class RegexAdapter extends Adapter {
  constructor({ regex, ...options }) {
    super(options);
    this.regex = regex;
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    let buffer = Buffer.concat([this.buffer, chunk]);
    let data;
    while ((data = this.regex.exec(buffer.toString()))) {
      this.push(this.shape?.(Array.from(data)) ?? Array.from(data));
      buffer = buffer.slice(data.index + data[0].length);
    }
    this.buffer = buffer;
    callback();
  }

  _flush(callback) {
    this.push([]);
    this.buffer = Buffer.alloc(0);
    callback();
  }
}

class Builder {
  constructor() {
    this._rx = {};
    this._tx = {};
  }

  rx() {
    this._current = this._rx;
    return this;
  }

  tx() {
    this._current = this._tx;
    return this;
  }

  regex(regex) {
    this._current.regex = regex;
    return this;
  }

  shape(shape) {
    this._current.shape = shape;
    return this;
  }

  build() {
    if (this._current.regex) return new RegexAdapter(this._current);
    return new Adapter(this._current);
  }
}

exports.Adapter = { Builder };
