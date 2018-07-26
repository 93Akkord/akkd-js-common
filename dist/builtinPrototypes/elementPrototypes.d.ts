declare global {
    interface Element {
        getBackgroundColor(pseudoElt?: string): any;
        getEventListeners(type: any): any[];
        index: number;
    }
    interface EventTarget {
        removeEventListeners(targetType: any): void;
    }
}
export declare var ListenerTracker: {
    isActive: boolean;
    _elements_: any[];
    _listeners_: any[];
    _listeners: any[];
    init(): any;
    registerElement(element: Element): any;
};
