Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
if (!helpers_1.isNode()) {
    Element.prototype.getBackgroundColor = function (pseudoElt) {
        var color = window.getComputedStyle(this, pseudoElt).getPropertyValue('background-color');
        if (color !== 'rgba(0, 0, 0, 0)')
            return color;
        if (this === document.body)
            return false;
        else
            return (this.parentElement) ? this.parentElement.getBackgroundColor() : null;
    };
    Object.defineProperty(Element.prototype, 'index', {
        get: function () {
            var nodes = Array.prototype.slice.call(this.parentElement.children);
            return nodes.indexOf(this);
        },
        configurable: true,
        enumerable: true
    });
}
exports.ListenerTracker = (function () {
    class _ListenerTracker {
        constructor() {
            this.isActive = false;
            // listener tracking datas
            this._elements_ = [];
            this._listeners_ = [];
            this._listeners = [];
        }
        init() {
            if (!this.isActive) //avoid duplicate call
                intercepEventsListeners();
            this.isActive = true;
            return this;
        }
        ;
        // register individual element an returns its corresponding listeners
        registerElement(element) {
            if (this._elements_.indexOf(element) == -1) {
                // NB : split by useCapture to make listener easier to find when removing
                var elt_listeners = [{ /*useCapture=false*/}, { /*useCapture=true*/}];
                this._elements_.push(element);
                this._listeners_.push(elt_listeners);
            }
            return this._listeners_[this._elements_.indexOf(element)];
        }
        ;
    }
    var listenerTracker = new _ListenerTracker();
    var intercepEventsListeners = function () {
        // backup overrided methods
        var _super_ = {
            "addEventListener": HTMLElement.prototype.addEventListener,
            "removeEventListener": HTMLElement.prototype.removeEventListener
        };
        Element.prototype['addEventListener'] = function (type, listener, useCapture) {
            var listeners = listenerTracker.registerElement(this);
            // add event before to avoid registering if an error is thrown
            _super_["addEventListener"].apply(this, arguments);
            // adapt to 'elt_listeners' index
            useCapture = useCapture ? 1 : 0;
            if (!listeners[useCapture][type])
                listeners[useCapture][type] = [];
            listeners[useCapture][type].push(listener);
            listenerTracker._listeners.push({
                target: this,
                type: type,
                listener: listener
            });
        };
        Element.prototype['removeEventListener'] = function (type, listener, useCapture) {
            var listeners = listenerTracker.registerElement(this);
            // add event before to avoid registering if an error is thrown
            _super_['removeEventListener'].apply(this, arguments);
            // adapt to 'elt_listeners' index
            useCapture = useCapture ? 1 : 0;
            if (!listeners[useCapture][type])
                return;
            var lid = listeners[useCapture][type].indexOf(listener);
            if (lid > -1)
                listeners[useCapture][type].splice(lid, 1);
        };
        EventTarget.prototype.removeEventListeners = function (targetType) {
            try {
                for (var index = 0; index != listenerTracker._listeners.length; index++) {
                    var item = listenerTracker._listeners[index];
                    var target = item.target;
                    var type = item.type;
                    var listener = item.listener;
                    if (target == this && type == targetType)
                        this.removeEventListener(type, listener);
                }
            }
            catch (ex) { }
        };
        Element.prototype.getEventListeners = function (type) {
            var listeners = listenerTracker.registerElement(this);
            // convert to listener datas list
            var result = [];
            for (var useCapture = 0, list; list = listeners[useCapture]; useCapture++) {
                if (typeof (type) == "string") { // filtered by type
                    if (list[type]) {
                        for (var id in list[type]) {
                            result.push({
                                "type": type,
                                "listener": list[type][id],
                                "useCapture": !!useCapture
                            });
                        }
                    }
                }
                else { // all
                    for (var _type in list) {
                        for (var id in list[_type]) {
                            result.push({
                                "type": _type,
                                "listener": list[_type][id],
                                "useCapture": !!useCapture
                            });
                        }
                    }
                }
            }
            return result;
        };
    };
    return listenerTracker;
})();
