"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBinder = exports.Event = void 0;
class Event {
    name;
    once;
    execute;
    constructor(options) {
        this.name = options.name;
        this.once = options.once;
        this.execute = options.execute;
    }
}
exports.Event = Event;
function eventBinder(client) {
    for (const event of client.events) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}
exports.eventBinder = eventBinder;
//# sourceMappingURL=index.js.map