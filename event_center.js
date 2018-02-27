const EventCenter = {
  _events: [],

  addEventListener: function (eventName, page, callback) {
    if (callback == null) {
      console.error("NotificationCenter: need callback");
      return;
    }

    this._events.push([eventName, page, callback]);
  },

  removeEventListener: function (eventName, page) {
    let index = this._events.findIndex((event) => {
      if (event[0] == eventName && event[1] === page) {
        return true;
      }
    })
    if (index !== -1) {
      this._events.splice(index, 1);
    }
  },

  dispatchEvent: function (eventName, argsObj) {
    this._events.forEach((event) => {
      if (event[0] === eventName) {
        event[2](argsObj);
      }
    })
  },
}

module.exports = {
  EventCenter: EventCenter,
  EVENT_LOGGED_IN: 1,
  EVENT_PAY_SUCCESS: 2,
}
