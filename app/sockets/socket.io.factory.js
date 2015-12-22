import io from 'socket.io-client';

export default class WebSockets {
  constructor($rootScope) {
    this.socket = io.connect("http://127.0.0.1:5001");
    this.rootScope = $rootScope;
  }

  on(eventName, callback) {
    this.socket.on(eventName, (data) => {
      this.rootScope.$apply(() => {
        callback.call(this, this.socket, data);
      });
    });
  }

  emit(eventName, data, callback) {
    this.socket.emit(eventName, data, () => {
      let args = arguments;
      this.rootScope.$apply(() => {
        if (callback) {
          callback.apply(this.socket, args);
        }
      });
    });
  }
}