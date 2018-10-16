(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var FUNCTION = 'function';
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    if (global['Zone']) {
        throw new Error('Zone already loaded.');
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._properties = null;
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                throw Error('Already loaded patch: ' + name);
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== FUNCTION) {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = undefined; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            // we have to define an variable here, if not
            // typescript compiler will complain below
            var isNotScheduled = task.state === notScheduled;
            if (isNotScheduled && task.type === eventTask) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = null;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this
                            .name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) {
            return delegate.hasTask(target, hasTaskState);
        },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
        onCancelTask: function (delegate, _, target, task) {
            return delegate.cancelTask(target, task);
        }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt =
                zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ?
                this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ?
                this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                return this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ?
                    ' or \'' + fromState2 + '\'' :
                    '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId;
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return null; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === FUNCTION) {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally          
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise = null || resolve(value));
            }
            function onReject(error) {
                promise && (promise = null || reject(error));
            }
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then(onResolve, onReject);
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            var count = 0;
            var resolvedValues = [];
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then((function (index) { return function (value) {
                    resolvedValues[index] = value;
                    count--;
                    if (!count) {
                        resolve(resolvedValues);
                    }
                }; })(count), reject);
                count++;
            }
            if (!count)
                resolve(resolvedValues);
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    function zoneify(fn) {
        return function () {
            var resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            var ctor = resultPromise.constructor;
            if (!ctor[symbolThenPatched]) {
                patchThen(ctor);
            }
            return resultPromise;
        };
    }
    if (NativePromise) {
        patchThen(NativePromise);
        var fetch_1 = global['fetch'];
        if (typeof fetch_1 == 'function') {
            global['fetch'] = zoneify(fetch_1);
        }
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result = listener && listener.apply(this, arguments);
    if (result != undefined && !result) {
        event.preventDefault();
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask, null);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        var customScheduleGlobal = function () {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var eventName = arguments[0];
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = eventName + FALSE_STR;
                    var trueEventName = eventName + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource + eventName;
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : null;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                task.options = options;
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    handleId: null,
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global.__Zone_ignore_on_properties;
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var _registerElement = document.registerElement;
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    document.registerElement = function (name, opts) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = 'Document.registerElement::' + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return _registerElement.call(document, name, opts);
    };
    attachOriginToPatched(document.registerElement, _registerElement);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
    registerElementPatch(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            XMLHttpRequest[XHR_SCHEDULED] = false;
            var data = task.data;
            var target = data.target;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && XMLHttpRequest[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        task.invoke();
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            XMLHttpRequest[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = {
                    target: self,
                    url: self[XHR_URL],
                    isPeriodic: false,
                    delay: null,
                    args: args,
                    aborted: false
                };
                return scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_services/index.ts":
/*!************************************!*\
  !*** ./src/app/_services/index.ts ***!
  \************************************/
/*! exports provided: PagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pager.service */ "./src/app/_services/pager.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PagerService", function() { return _pager_service__WEBPACK_IMPORTED_MODULE_0__["PagerService"]; });




/***/ }),

/***/ "./src/app/_services/pager.service.ts":
/*!********************************************!*\
  !*** ./src/app/_services/pager.service.ts ***!
  \********************************************/
/*! exports provided: PagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PagerService", function() { return PagerService; });
//import * as _ from 'underscore';
var PagerService = /** @class */ (function () {
    function PagerService() {
    }
    PagerService.prototype.getPager = function (totalItems, currentPage, pageSize) {
        if (currentPage === void 0) { currentPage = 1; }
        if (pageSize === void 0) { pageSize = 3; }
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        }
        else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            }
            else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            }
            else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        // create an array of pages to ng-repeat in the pager control
        //let pages = _.range(startPage, endPage + 1); disabling under_score library
        var pages = Array.from(Array(endPage + 1 - startPage), function (_, x) { return x + startPage; });
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    };
    return PagerService;
}());



/***/ }),

/***/ "./src/app/about/about.component.css":
/*!*******************************************!*\
  !*** ./src/app/about/about.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/about/about.component.html":
/*!********************************************!*\
  !*** ./src/app/about/about.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  about works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/about/about.component.ts":
/*!******************************************!*\
  !*** ./src/app/about/about.component.ts ***!
  \******************************************/
/*! exports provided: AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return AboutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AboutComponent = /** @class */ (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-about',
            template: __webpack_require__(/*! ./about.component.html */ "./src/app/about/about.component.html"),
            styles: [__webpack_require__(/*! ./about.component.css */ "./src/app/about/about.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<router-outlet></router-outlet>\r\n\r\n\r\n<app-footer></app-footer>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: HttpLoaderFactory, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _car_item_car_item_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./car-item/car-item.component */ "./src/app/car-item/car-item.component.ts");
/* harmony import */ var _photo_swipe_photo_swipe_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./photo-swipe/photo-swipe.component */ "./src/app/photo-swipe/photo-swipe.component.ts");
/* harmony import */ var _services_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_services/index */ "./src/app/_services/index.ts");
/* harmony import */ var _members_members_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./members/members.component */ "./src/app/members/members.component.ts");
/* harmony import */ var _main_main_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./main/main.component */ "./src/app/main/main.component.ts");
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.routes */ "./src/app/app.routes.ts");
/* harmony import */ var _file_drop_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./file-drop.directive */ "./src/app/file-drop.directive.ts");
/* harmony import */ var _upload_form_upload_form_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./upload-form/upload-form.component */ "./src/app/upload-form/upload-form.component.ts");
/* harmony import */ var ng2_img_max__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ng2-img-max */ "./node_modules/ng2-img-max/dist/ng2-img-max.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/@ngx-translate/core.es5.js");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./core/auth.service */ "./src/app/core/auth.service.ts");
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./auth.guard */ "./src/app/auth.guard.ts");
/* harmony import */ var angularfire2__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! angularfire2 */ "./node_modules/angularfire2/index.js");
/* harmony import */ var angularfire2_firestore__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! angularfire2/firestore */ "./node_modules/angularfire2/firestore/index.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var _reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./reset-password/reset-password.component */ "./src/app/reset-password/reset-password.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _signup_signup_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./signup/signup.component */ "./src/app/signup/signup.component.ts");
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./contact/contact.component */ "./src/app/contact/contact.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/footer/footer.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















//import { UserLoginComponent } from './users/user-login/user-login.component';
//import { UserProfileComponent } from './users/user-profile/user-profile.component';











function HttpLoaderFactory(http) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_15__["TranslateHttpLoader"](http);
}
var firebaseConfig = {
    apiKey: "AIzaSyAIblq6kLPLBguR_GUkRgzTu8ou219yoLk",
    authDomain: "motorat-a0355.firebaseapp.com",
    databaseURL: "https://motorat-a0355.firebaseio.com",
    projectId: "motorat-a0355",
    storageBucket: "motorat-a0355.appspot.com",
    messagingSenderId: "953142823882"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _car_item_car_item_component__WEBPACK_IMPORTED_MODULE_5__["CarItemComponent"],
                _members_members_component__WEBPACK_IMPORTED_MODULE_8__["MembersComponent"],
                _main_main_component__WEBPACK_IMPORTED_MODULE_9__["MainComponent"],
                _file_drop_directive__WEBPACK_IMPORTED_MODULE_11__["FileDropDirective"],
                _upload_form_upload_form_component__WEBPACK_IMPORTED_MODULE_12__["UploadFormComponent"],
                _photo_swipe_photo_swipe_component__WEBPACK_IMPORTED_MODULE_6__["PhotoSwipeComponent"],
                //UserProfileComponent,
                _signup_signup_component__WEBPACK_IMPORTED_MODULE_23__["SignupComponent"],
                _reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_21__["ResetPasswordComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_22__["LoginComponent"],
                _contact_contact_component__WEBPACK_IMPORTED_MODULE_24__["ContactComponent"],
                _about_about_component__WEBPACK_IMPORTED_MODULE_25__["AboutComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_26__["FooterComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__["TranslateLoader"],
                        useFactory: HttpLoaderFactory,
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]]
                    }
                }),
                ng2_img_max__WEBPACK_IMPORTED_MODULE_13__["Ng2ImgMaxModule"],
                _app_routes__WEBPACK_IMPORTED_MODULE_10__["routes"],
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_20__["AngularFireAuthModule"],
                angularfire2_firestore__WEBPACK_IMPORTED_MODULE_19__["AngularFirestoreModule"],
                angularfire2__WEBPACK_IMPORTED_MODULE_18__["AngularFireModule"].initializeApp(firebaseConfig),
            ],
            providers: [
                _services_index__WEBPACK_IMPORTED_MODULE_7__["PagerService"],
                _core_auth_service__WEBPACK_IMPORTED_MODULE_16__["AuthService"],
                _auth_guard__WEBPACK_IMPORTED_MODULE_17__["AuthGuard"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routes.ts":
/*!*******************************!*\
  !*** ./src/app/app.routes.ts ***!
  \*******************************/
/*! exports provided: router, routes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "router", function() { return router; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _members_members_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./members/members.component */ "./src/app/members/members.component.ts");
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.guard */ "./src/app/auth.guard.ts");
/* harmony import */ var _main_main_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./main/main.component */ "./src/app/main/main.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _signup_signup_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./signup/signup.component */ "./src/app/signup/signup.component.ts");
/* harmony import */ var _reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reset-password/reset-password.component */ "./src/app/reset-password/reset-password.component.ts");
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./contact/contact.component */ "./src/app/contact/contact.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");


//import { AuthGuard } from './auth.guard';







var router = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: _main_main_component__WEBPACK_IMPORTED_MODULE_3__["MainComponent"] },
    { path: 'contact', component: _contact_contact_component__WEBPACK_IMPORTED_MODULE_7__["ContactComponent"] },
    { path: 'about', component: _about_about_component__WEBPACK_IMPORTED_MODULE_8__["AboutComponent"] },
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"] },
    { path: 'signup', component: _signup_signup_component__WEBPACK_IMPORTED_MODULE_5__["SignupComponent"] },
    // { path: 'login-email', component: EmailComponent },
    { path: 'reset', component: _reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_6__["ResetPasswordComponent"] },
    { path: 'members', component: _members_members_component__WEBPACK_IMPORTED_MODULE_1__["MembersComponent"], canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]] }
    // { path: 'members', component: MembersComponent }
];
var routes = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(router);


/***/ }),

/***/ "./src/app/auth.guard.ts":
/*!*******************************!*\
  !*** ./src/app/auth.guard.ts ***!
  \*******************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var rxjs_add_operator_do__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/do */ "./node_modules/rxjs/_esm5/add/operator/do.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var rxjs_add_operator_take__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/add/operator/take */ "./node_modules/rxjs/_esm5/add/operator/take.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/auth.service */ "./src/app/core/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AuthGuard = /** @class */ (function () {
    function AuthGuard(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        // return this.auth.user
        return this.auth.user
            .take(1)
            .map(function (user) { return !!user; })
            .do(function (loggedIn) {
            if (!loggedIn) {
                console.log('access denied');
                _this.router.navigate(['/login']);
            }
        });
    };
    AuthGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_core_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/car-item/car-item.component.css":
/*!*************************************************!*\
  !*** ./src/app/car-item/car-item.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".rtltest{\r\n    direction: rtl;\r\n}\r\n\r\n \r\n    .row-rtl {\r\n           margin-right: 10px;\r\n             \r\n       \r\n    }\r\n\r\n \r\n    a:hover{\r\n\t \r\n\tfont-style: italic;\r\n\ttext-decoration: none;\r\n}\r\n\r\n \r\n    a{\r\n    color:white;\r\n    cursor: pointer;\r\n\t\r\n}\r\n\r\n \r\n    .ppage{\r\n    color:rgb(19, 35, 73);\r\n}\r\n\r\n \r\n    .logo{\r\n    vertical-align: bottom;\r\n    margin-bottom: .0em;\r\n    margin-top: 1em;\r\n   /*  margin-bottom:-20px ; */\r\n}\r\n\r\n \r\n    .num_of_img {\r\n    background-color: red;\r\n    position: absolute;\r\n    /* bottom: 5px; */\r\n    /* right: 5px;  */\r\n    pointer-events: none;\r\n    font-size: 13px;\r\n    font-family: Lato, \"Times New Roman\", Tahoma, bold , Helvetica, sans-serif;\r\n   /*  padding: 1px 4px; */\r\n\r\n    /* top: 100px; */\r\n    color:white;\r\n    left: 35px; \r\n    font-weight: bold;\r\n    \r\n}\r\n\r\n \r\n    .toggleLang{\r\n    text-align: right;\r\n    direction: rtl;\r\n}\r\n\r\n \r\n    .rightOfBox{\r\n    float: left;\r\n /*  //  text-align: left; */\r\n   /*  font-weight: bold; */\r\n    color: black;\r\n    font-family:Verdana, sans-serif;\r\n /*  //  text-align: right; */\r\n     \r\n}\r\n\r\n \r\n    .container2 {\r\n    position: relative;\r\n    text-align: left;\r\n    color: solid rgba(58, 33, 134, 0.514);\r\n    margin-left: 0%;\r\n    padding-left: 0%;\r\n    \r\n   /* height: 200px;*/\r\n   /*  float: left; */\r\n\r\n}\r\n\r\n \r\n    .SearchBox {\r\n    background-color: rgba(216, 221, 214, 0.705); \r\n    /* background-color: rgba(211, 211, 211, 0.404);  */\r\n    /* width: 200px; */\r\n   /*  border: 1px solid rgba(83, 50, 145, 0.575); */\r\n    padding: 10px;\r\n    margin: 1px;\r\n}\r\n\r\n \r\n    .contactBox {\r\n    background-color: #2A6496;\r\n\r\n    width: 10em; \r\n    border: 1px solid #2A6496;\r\n    padding: 10px;\r\n    margin: 1px;\r\n    text-align: center;\r\n    color: white;\r\n    /* float: right;  */\r\n}\r\n\r\n \r\n    .searchh2{\r\n    \r\n  /*   font-weight: bold; */\r\n  font-family:Verdana, sans-serif;\r\n\r\n   /*  align :center; */\r\n}\r\n\r\n \r\n    /* .containerPrice{\r\n    color: #2A6496;\r\n    float: right; \r\n    font-weight: bold;\r\n   \r\n}\r\n\r\n.containerKilo{\r\n    color: rgb(67, 152, 226);\r\n    float: right; \r\n    font-weight: bold;\r\n     \r\n}\r\n\r\n.containerYear{\r\n    color: black;\r\n    float: right; \r\n    font-weight: bold;\r\n   \r\n} */\r\n\r\n \r\n    .verticalLine {\r\n   /*  border-left: 3px solid rgba(58, 33, 134, 0.514); */\r\n    border-left: 3px solid #2A6496;\r\n    height: 180px;\r\n   \r\n    float: left;\r\n    padding-right: 10px;\r\n}\r\n\r\n \r\n    .containerTitle\r\n{\r\n     \r\n    /* float: left; */\r\n    text-align: left;\r\n    font-size: large;\r\n    font-weight: bold;\r\n    font-family:Verdana, sans-serif;\r\n   /*  padding-bottom: center; */\r\n}\r\n\r\n \r\n    .title{\r\n    font-family: Ubuntu;\r\n    text-transform: uppercase;\r\n   font-size: large;\r\n    font-weight: bold;\r\n   \r\n    color:black;\r\n}\r\n\r\n \r\n    img{\r\n   width:170px; \r\n   height:115px; \r\n}\r\n\r\n \r\n    img:hover{\r\n    width:210px; \r\n    height:145px;\r\n    cursor: pointer;\r\n}\r\n\r\n \r\n    showPhone:hover{\r\n     \r\n   \r\n    font-size: x-large;\r\n}\r\n\r\n \r\n    .details{\r\n    /*  font-weight:   normal;  */\r\n     font-size:  small; \r\n    font-family:  ubuntu;\r\n  /*   font-weight: bold; */\r\n    \r\n   \r\n}\r\n\r\n \r\n    .detailsBold{\r\n    font-weight:   bold;\r\n    font-size:   small;\r\n    font-family:  ubuntu;\r\n    direction: rtl;\r\n    \r\n}\r\n\r\n \r\n    .fontUbuntu{\r\n    font-family: ubuntu;\r\n  /*   font-weight:   normal; */\r\n /*  font-style: italic; */\r\n \r\n    \r\n}\r\n\r\n \r\n    .SearchTitle{\r\n\r\n    font-family: ubuntu;\r\n     \r\n    font-size: x-large;\r\n    \r\n  \r\n\r\n    \r\n}\r\n\r\n \r\n    .SearchDetails{\r\n    font-weight:   normal;\r\n   /*  font-size: x-small; */\r\n    font-family: Verdana, Geneva, sans-serif;\r\n\r\n}\r\n\r\n \r\n    ul \r\n{\r\n    line-height:100%;  \r\n    padding-left: 3%;\r\n  \r\n   \r\n}\r\n\r\n \r\n    hr {\r\n    /* border: 0; */\r\n    clear:both;\r\n    display:block;\r\n    /*  width: 96%;  */              \r\n    /* background-color:black; */\r\n    height: 4px;\r\n  }\r\n\r\n \r\n    /* img {\r\n    display: block;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n   \r\n} */\r\n\r\n \r\n    .container-fluid {\r\n    margin-left: 1%;\r\n    margin-right: 2%;\r\n}\r\n\r\n \r\n    .PlaceAd{\r\n  \r\nfloat: right;\r\n \r\n    text-align: left;\r\n   /*  font-weight: bold; */\r\n    color: rgba(184, 207, 228, 0.877);\r\n    font-family:ubuntu;\r\n    font-size: medium;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n}\r\n\r\n \r\n    .login{\r\n  \r\n    float: left;\r\n    text-align: left;\r\n    font-size: medium;\r\n    /* font-weight: bold; */\r\n    color: rgba(184, 207, 228, 0.877);\r\n    font-family:ubuntu;\r\n    }\r\n\r\n \r\n    .lang{\r\n    float: right;\r\n    text-align: right;\r\n    font-weight: bold;\r\n    color: rgba(78, 10, 10, 0.699);\r\n    font-family:ubuntu;\r\n    font-size: medium;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n}\r\n\r\n \r\n    .about{\r\n    float: left;\r\n    text-align: left;\r\n   /*  font-weight: bold; */\r\n    color: rgba(255, 255, 255, 0.781);\r\n    font-family:ubuntu;\r\n    font-size: medium;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n    \r\n}\r\n\r\n \r\n    .tab{\r\n    background-color: rgb(3, 17, 31);\r\n    overflow: auto;\r\n    align-items : center;\r\n    \r\n   \r\n  border: none;\r\n} \r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/car-item/car-item.component.html":
/*!**************************************************!*\
  !*** ./src/app/car-item/car-item.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"tab\">\r\n        <div class=\"col-md-2\"> </div>\r\n        <div class=\"col-md-8\">\r\n\r\n            <br>\r\n            <div class='about'> Home</div>\r\n            <div class='about'> &nbsp;&nbsp; About </div>\r\n            <div class='about'> &nbsp;&nbsp; Contact </div>\r\n            <div class='login'> &nbsp;&nbsp; Login</div>\r\n            \r\n            <div class=\"PlaceAd \" (click)=\"placeYourAd()\">Place Your Ad</div>\r\n            <div class='lang'> العربية &nbsp;&nbsp;</div>\r\n              <br> <br> \r\n        </div>\r\n    </div> -->\r\n\r\n\r\n\r\n<!--   <h1  style='display: inline;font-weight: bold;  text-decoration: underline; \r\n   font-family: Tangerine,serif;  color:orange;'>Motorat.ae>   </h1> -->\r\n\r\n\r\n<div class='row'>\r\n    <div class=\"col-md-1\"></div>\r\n    <div class=\"col-md-6\">\r\n\r\n        <h1 class='logo' align='right' style='display: inline;   \r\n               font-family:ubuntu; font-weight: bold '\r\n            translate>Title</h1>\r\n    </div>\r\n    <div class=\"col-md-2\"></div>\r\n    <div class=\"col-md-3 \">\r\n        <h2 class='logo' style='display: inline;   text-decoration: underline; \r\n       font-family:Shrikhand, cursive; color:gray;'>ZEZENIA.ae<span\r\n                style=\"color:orange\">#</span></h2> <!-- zezenia -->\r\n\r\n        <img class='logo' style='width:80px;height:25px;    vertical-align: bottom;   ' src=\"assets/logo.png\">\r\n    </div>\r\n\r\n</div>\r\n\r\n<div class=\"tab\">\r\n\r\n    <div class=\"col-md-2\"> </div>\r\n    <div class=\"col-md-8\">\r\n            \r\n\r\n        <div class='about' (click)=\"router.navigate(['/about'])\">\r\n            <a translate>About</a> &nbsp;| &nbsp;\r\n        </div>\r\n        <div class='about' (click)=\"router.navigate(['/contact'])\">\r\n            <a translate>Contact </a> &nbsp;| &nbsp;\r\n        </div>\r\n        <div class='about' (click)=\"router.navigate(['/members'])\">\r\n            <a translate>Register</a> &nbsp;| &nbsp;\r\n        </div>\r\n        <div class='login about' (click)=\"router.navigate(['/members'])\"> &nbsp; &nbsp; &nbsp;\r\n            <a style=\"color: rgba(241, 237, 237, 0.493);\" translate><i class=\"fa fa-sign-in\" style=\"font-size:normal;color:greenyellow\">&nbsp;</i>Login</a>\r\n        </div>\r\n\r\n        <div class=\"PlaceAd \" (click)=\"router.navigate(['/members'])\">\r\n            <a style='color: rgb(83, 156, 219)' translate>PlaceAd</a>\r\n        </div>\r\n        <div class='lang'>\r\n            <a (click)=\"switchLanguage()\" translate>lang </a>&nbsp;&nbsp;</div>\r\n\r\n\r\n    </div>\r\n    <div class=\"col-md-2\"> </div>\r\n\r\n\r\n</div>\r\n\r\n<!-- <img  class='logo'  style='width:150px;height:200px;  display: block;\r\nmargin-left: auto;\r\nmargin-right: auto;      ' src=\"assets/eagle.svg\"> -->\r\n\r\n\r\n<div class=\"container-fluid\" [class.toggleLang]=\"toggleLanguage\">\r\n\r\n\r\n\r\n    <br>\r\n    <br>\r\n    <br>\r\n    <br>\r\n    <br>\r\n    <br> <br>\r\n    <br>\r\n    <br> <br>\r\n    <br>\r\n    <br>\r\n    \r\n    <div class=\"col-md-1\"> </div>\r\n\r\n    <div class=\" col-md-2\">\r\n\r\n        <div class=\"row\">\r\n\r\n\r\n            <div class=\"SearchBox fontUbuntu col-md-12\">\r\n                <form #SearchFrm=\"ngForm\" (ngSubmit)=\"SearchCar(SearchFrm)\">\r\n                    <h4 align=\"center\" class=\"SearchTitle\" translate> Search</h4>\r\n\r\n\r\n                    <div class=\"form-group \">\r\n                        <!-- <label for=\"\" >\r\n                                <span translate>city</span>:\r\n                            </label>\r\n    \r\n                            <input type=\"text\" class=\"form-control  input-sm\" name=\"carcolor\" value=\"\" [ngModel]=\"ColorToSearch\"> -->\r\n\r\n\r\n\r\n\r\n\r\n\r\n                        <label class=\"label label-primary\" for=\"carcity\" translate>\r\n                            city\r\n                        </label>\r\n\r\n                        <select class=\"form-control input-sm\" name=\"cityToSearch\" value=\"\" ngModel>\r\n                            <option selected value>All</option>\r\n                            <option>Abu Dhabi</option>\r\n                            <option>Ajman</option>\r\n                            <option>Alain</option>\r\n                            <option>Dubai</option>\r\n                            <option>Fujaira</option>\r\n                            <option>Ras Alkhaima</option>\r\n                            <option>Sharjah</option>\r\n                            <option>Um Alqwain</option>\r\n\r\n\r\n                        </select>\r\n\r\n                    </div>\r\n\r\n                    <div class=\"form-group \">\r\n\r\n                         <label class=\"label label-primary\" for=\"\" translate>\r\n                            Manufacturer\r\n                        </label>\r\n                        <select class=\"form-control input-sm\" name=\"manufacturerToSearch\" (change)=\"onManufacturersChange($event.target.value)\"\r\n                            ngModel>\r\n                            <option selected value>All</option>\r\n                            <option *ngFor=\"let m of ManufacturersObject\">\r\n                                {{m.manufacture_name}}\r\n                            </option> \r\n                           <!--  <label class=\"label label-primary\" for=\"\" translate>\r\n                                    Manufacturer\r\n                            <input list=\"browsers\" class=\"form-control input-sm\" name=\"manufacturerToSearch\" (change)=\"onManufacturersChange($event.target.value)\" /></label>\r\n                            <datalist id=\"browsers\">\r\n                                    <option selected value>All</option>\r\n                                    <option *ngFor=\"let m of ManufacturersObject\">\r\n                                        {{m.MANUFACTURE_NAME}}\r\n                                    </option>\r\n                            </datalist> -->\r\n                         </select>  \r\n\r\n                        <!--   <select class=\"form-control input-sm\"   name=\"manufacturerToSearch\" ngModel>\r\n                                        <option selected value>All</option>\r\n                                        <option>NISSAN</option>\r\n                                        <option>TOYOTA</option>\r\n                                         \r\n                                      </select> -->\r\n\r\n                    </div>\r\n\r\n                    <div *ngIf=\"showModel\" class=\"form-group \">\r\n\r\n                        <label class=\"label label-primary\" for=\"\" translate>\r\n                            Model:\r\n                        </label>\r\n\r\n                        <select class=\"form-control input-sm\" name=\"modelToSearch\" ngModel>\r\n\r\n                            <option selected value>All</option>\r\n                            <option *ngFor=\"let model of ModelsObject\">\r\n                                {{model.model_name}}\r\n                            </option>\r\n\r\n                        </select>\r\n\r\n                    </div>\r\n\r\n\r\n                    <div class=\"form-group \">\r\n\r\n                        <label class=\"label label-primary\" for=\"color\" translate>\r\n                            Color\r\n                        </label>\r\n\r\n                        <select class=\"form-control input-sm\" name=\"colorToSearch\" ngModel>\r\n                            <option selected value>All</option>\r\n                            <option>Silver</option>\r\n                            <option>White</option>\r\n                            <option>Brown</option>\r\n                            <option> Black</option>\r\n                            <option>Blue</option>\r\n                            <option>Red</option>\r\n                            <option>Gray</option>\r\n                            <option>Green</option>\r\n                            <option>Gold</option>\r\n                            <option>Yellow</option>\r\n                            <option>Other</option>\r\n\r\n                        </select>\r\n\r\n                    </div>\r\n\r\n                    <div class=\"form-group \" style=' padding-right:13px;padding-left:13px;' dir=\"ltr\">\r\n                        <label for=\"\" translate>\r\n                            Year\r\n                        </label>\r\n\r\n                        <input style='width:100%; ' id=\"year\" type=\"text\" data-slider-value=\"[1990,2018 ]\" />\r\n\r\n                    </div>\r\n\r\n\r\n                    <div class=\"form-group \" style='padding-right:13px;padding-left:13px;' dir=\"ltr\">\r\n                        <label for=\"\" translate>\r\n                            Kilometers\r\n                        </label>\r\n\r\n\r\n                        <input style='width:100%; ' id=\"kilo\" type=\"text\" data-slider-value=\"[0,200 ]\" />\r\n\r\n\r\n                    </div>\r\n\r\n\r\n\r\n                    <div class=\"form-group \" style='padding-right:13px;padding-left:13px;' dir=\"ltr\">\r\n                        <!--  <label for=\"\" translate>\r\n                                price from to:\r\n                            </label>\r\n    \r\n                            <input type=\"text\" class=\"form-control  input-sm\" name=\"carcolor\" value=\"\" [ngModel]=\"ColorToSearch\"> -->\r\n\r\n                        <label for=\"customRange1\" translate>Price</label>\r\n\r\n                        <!--   <input type=\"text\" class=\"js-min-max-start\" style='font-size: small' /> -->\r\n\r\n\r\n                        <!--                       <input style=' width: 90%;' id=\"ex1\"  data-slider-id='ex1Slider' type=\"text\" data-slider-min=\"0\" data-slider-max=\"100000\" data-slider-step=\"1\" data-slider-value=\"[0,50000]\"/> \r\n -->\r\n                        <input style='width:100%; ' id=\"price\" type=\"text\" data-slider-value=\"[0,100 ]\" />\r\n                        <!--  <input id=\"ex12c\" type=\"text\"/><br/>  -->\r\n                    </div>\r\n\r\n\r\n\r\n                    <div class=\"form-group \">\r\n                        <label for=\"\" translate>\r\n                            Cylinder\r\n                        </label>\r\n                        <select class=\"form-control input-sm\" name=\"cylinderToSearch\" ngModel>\r\n                            <option selected value>All</option>\r\n                            <option>3</option>\r\n                            <option>4</option>\r\n                            <option>6</option>\r\n                            <option>8</option>\r\n                            <option>12</option>\r\n                        </select>\r\n                    </div>\r\n\r\n                    <div class=\"form-group \">\r\n                        <label for=\"\" translate>\r\n                            Specs\r\n                        </label>\r\n                        <select class=\"form-control input-sm\" name=\"specificationToSearch\" ngModel>\r\n                            <option selected value>All</option>\r\n                            <option>GCC</option>\r\n                            <option>AMERICAN</option>\r\n                            <option>JAPANESE</option>\r\n                            <option>EUROPE</option>\r\n                            <option>OHTER</option>\r\n                        </select>\r\n                    </div>\r\n\r\n\r\n                    <div class=\"form-group \">\r\n                        <label for=\"\" translate>\r\n                            Transmission\r\n                        </label>\r\n                        <select class=\"form-control input-sm\" name=\"transmissionToSearch\" ngModel>\r\n                            <option selected value>All</option>\r\n                            <option>Automatic</option>\r\n                            <option>Manual</option>\r\n                            <option>Hybrid</option>\r\n\r\n                        </select>\r\n                    </div>\r\n\r\n                    <button type=\"submit\" name='button' class=' btn btn-block  btn-primary'><i translate>Go</i></button>\r\n\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <app-photo-swipe #photoSwipe></app-photo-swipe>\r\n\r\n\r\n\r\n    <!-- pagination -->\r\n    <div class=\"col-md-7\">\r\n\r\n        <div class='row' [class.row-rtl]=\"toggleLanguage\">\r\n            <div [class.col-md-9]=\"toggleLanguage\"></div>\r\n            <div class=\"col-md-3\">\r\n                <label for=\"\" translate>\r\n                    <b translate>SortBy </b>:\r\n                </label>\r\n                <select class=\"form-control input-sm\" (change)=\"onSortByChange($event.target.value)\" name=\"SortBy\"\r\n                    ngModel>\r\n                    <option>Price lowest to highest</option>\r\n                    <option>Price highest to lowest </option>\r\n                    <option>Date</option>\r\n\r\n\r\n                </select>\r\n                <br>\r\n\r\n            </div>\r\n\r\n\r\n        </div>\r\n\r\n\r\n\r\n        <div class='row' [class.row-rtl]=\"toggleLanguage\" style='font-family: ubuntu'>\r\n            <div [class.col-md-6]=\"toggleLanguage\"></div>\r\n\r\n            &nbsp;&nbsp;&nbsp; <a style=\"color:black;\" (click)=\"resetSearch('allCiteis')\" translate> AllCities </a>\r\n            > {{CityToSearch}} > <a style=\"color:black;\" (click)=\"resetSearch('AllManufacturer')\" translate>\r\n                AllManufacturer</a> > {{ManufacturerToSearch}} >\r\n            <a style=\"color:black;\" (click)=\"resetSearch('AllModel')\" translate> AllModel</a> > {{ModelToSearch}}\r\n\r\n\r\n        </div>\r\n\r\n        <br>\r\n        <div>\r\n            <!-- <h1>Angular 2 - Pagination Example with logic like Google</h1> -->\r\n\r\n            <!-- items being paged -->\r\n            <div class='row'>\r\n                <br>\r\n\r\n                <ul style=\"list-style:none\">\r\n\r\n                    <li *ngFor=\"let obj of carsObjects;  let i = index\">\r\n                        <!-- <div class=\"container2\" *ngFor=\"let thumb of objs.thums;  let j = index\"> \r\n                \r\n                     <div class=\"num_of_img\"> +: {{obj.thums.length}}  </div>\r\n                     <img (click)=\"openSlideshow(i,j);\" style=\"width:100px;height:100px;\" [src]=\"obj.thums[j].src\">\r\n\r\n                 </div>  -->\r\n\r\n                        <!--  <div class=\"container2\" *ngFor=\"let thumb of obj.thums;  let j = index\">  -->\r\n                        <div class=\"cardd\">\r\n\r\n\r\n                            <!-- <div class=\"contactBox\"> contact </div> -->\r\n\r\n                            <div class=\"container2 col-md-6\">\r\n                                <div class=\"verticalLine\"></div>\r\n\r\n                                <div class=\"title\"> {{obj.manufacture}}> {{obj.model }}> {{obj.specs}}\r\n                                </div>\r\n                                <!-- containerTitle -->\r\n\r\n                                <br>\r\n\r\n                                <div class=\"num_of_img\"> +{{obj.thums.length}} </div>\r\n\r\n                                <img (click)=\"openSlideshow(i,j);\" [src]=\"obj.thums[0]\">\r\n                                <br>\r\n                                <br>\r\n                                <div class='fontUbuntu'> <i translate>Located:</i> {{obj.city}} , <i translate>Date:</i>\r\n                                    {{obj.date| date : \"dd MMMM yyyy\" }}</div>\r\n                                <br>\r\n                                <br>\r\n\r\n                            </div>\r\n                            <div class=\"rightOfBox col-md-3\">\r\n                                <div class='details' translate>warranty\r\n                                    <span class='detailsBold'> : {{obj.warranty}} </span></div>\r\n\r\n                                <!-- <br> -->\r\n                                <br>\r\n                                <div class='details' translate>Transmission\r\n                                    <span> : </span> <span class='detailsBold' translate>{{obj.transmission}}</span>\r\n                                </div>\r\n                                <br>\r\n                                <div class='details' translate>Cylinder\r\n                                    <span class='detailsBold'> : {{ obj.cylinder}}</span>\r\n                                </div>\r\n                                <br>\r\n                                <div class='details' translate>Color\r\n                                    <span> : </span> <span class='detailsBold' translate>{{ obj.color}}</span>\r\n                                </div>\r\n                            </div>\r\n\r\n\r\n                            <div class=\"rightOfBox col-md-3\">\r\n\r\n                                <div class='details' translate>Price\r\n                                    <span class='detailsBold'> : {{obj.price | number}} <span translate> AED</span>\r\n                                    </span></div>\r\n\r\n                                <br>\r\n                                <div class='details' translate>Kilometers\r\n                                    <span class='detailsBold'> : {{obj.kilometers| number}} <span translate> km</span>\r\n                                    </span></div>\r\n\r\n                                <!-- <br> -->\r\n                                <br>\r\n                                <div class='details' translate>Year\r\n                                    <span class='detailsBold'> : {{obj.year}}</span>\r\n                                </div>\r\n                                <br>\r\n\r\n\r\n                                <br>\r\n\r\n\r\n                                <br>\r\n                                <br>\r\n                                <div class=\"showPhone btn btn-warning btn-sm\" (click)='showPhone(obj.phone,$event)'\r\n                                    translate> Phone:</div>\r\n                                <br>\r\n                                <br>\r\n                            </div>\r\n\r\n                            <hr>\r\n                        </div>\r\n\r\n\r\n\r\n                    </li>\r\n\r\n\r\n                </ul>\r\n            </div>\r\n\r\n            <!-- pager -->\r\n            <div class=\"pager\">\r\n                <ul *ngIf=\"pager.pages && pager.pages.length\" class=\"pagination\">\r\n                    <li [ngClass]=\"{disabled:pager.currentPage === 1}\">\r\n                        <a (click)=\"setPage(1)\" translate>First</a>\r\n                    </li>\r\n                    <li [ngClass]=\"{disabled:pager.currentPage === 1}\" class=\"page-item\">\r\n                        <a (click)=\"setPage(pager.currentPage - 1)\" translate>Previous</a>\r\n                    </li>\r\n                    <li class=\"page-item\" *ngFor=\"let page of pager.pages\" [ngClass]=\"{active:pager.currentPage === page}\">\r\n                        <a class='ppage' (click)=\"setPage(page)\">{{page}}</a>\r\n                    </li>\r\n                    <li class=\"page-item\" [ngClass]=\"{disabled:pager.currentPage === pager.totalPages}\">\r\n                        <a (click)=\"setPage(pager.currentPage + 1)\" translate>Next</a>\r\n                    </li>\r\n                    <li class=\"page-item\" [ngClass]=\"{disabled:pager.currentPage === pager.totalPages}\">\r\n                        <a (click)=\"setPage(pager.totalPages)\" translate>Last</a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!--   end of paginagtion  -->\r\n\r\n\r\n    <div class=\"col-md-2\"></div>\r\n    \r\n    \r\n    \r\n</div>\r\n\r\n<br><br> "

/***/ }),

/***/ "./src/app/car-item/car-item.component.ts":
/*!************************************************!*\
  !*** ./src/app/car-item/car-item.component.ts ***!
  \************************************************/
/*! exports provided: CarItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarItemComponent", function() { return CarItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _services_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/index */ "./src/app/_services/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util */ "./src/util.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/@ngx-translate/core.es5.js");
/* harmony import */ var _photo_swipe_photo_swipe_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../photo-swipe/photo-swipe.component */ "./src/app/photo-swipe/photo-swipe.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





//import { Http ,Response } from '@angular/http';
/* import { HttpClient, HttpEventType } from '@angular/common/http'; */

/* import { IImage              } from '../interfaces/image'; */

var CarItemComponent = /** @class */ (function () {
    function CarItemComponent(router, pagerService, dataService, translate) {
        this.router = router;
        this.pagerService = pagerService;
        this.dataService = dataService;
        this.translate = translate;
        this.carList = [];
        this.SortBy = 'Date';
        this.CityToSearch = '';
        this.ManufacturerToSearch = '';
        this.ModelToSearch = '';
        this.YearToSearch = '';
        this.ColorToSearch = '';
        this.cylinderToSearch = '';
        this.transmissionToSearch = '';
        this.specificationToSearch = '';
        this.toggleForm = false;
        this.show_me = true;
        this.showModel = false;
        this.theHtmlString = 'Phone:';
        //firstTime: boolean = true;
        this.cities = ["Abu Dabu", "Ajman", "Al ain", "Dubai", "Fujuira", "Ras Alkhima", "Sharjah", "Um Alquiin"];
        this.specs = ["GCC", "AMERICAN", "JAPANESE", "EUROPE", "OTHER"];
        this.carsObjects = [];
        this.ManufacturersObject = [];
        this.ModelsObject = [];
        this.toggleLanguage = false;
        this.rtl = 'rtl';
        // pager object
        this.pager = {};
        this.index = 1;
        this.currentOffset = 0;
        this.currentPage = 1;
        this.toSearch = {};
        translate.setDefaultLang('en');
    }
    CarItemComponent.prototype.switchLanguage = function (language) {
        // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
        _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].toggleLanguage = !_util__WEBPACK_IMPORTED_MODULE_3__["Utils"].toggleLanguage;
        this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].toggleLanguage;
        if (_util__WEBPACK_IMPORTED_MODULE_3__["Utils"].toggleLanguage == true) {
            this.translate.use('ar');
            this.rtl = 'rtl';
        }
        else {
            this.translate.use('en');
            this.rtl = 'ltr';
        }
    };
    // ========================================================================
    CarItemComponent.prototype.openSlideshow = function (i, j) {
        /*    const index = this.index;
         
    
         
            const images = [
    
           { src: 'http://via.placeholder.com/600x400', w: 600, h: 400 },
           { src: 'http://via.placeholder.com/800x600', w: 800, h: 600 },
           // ...
       ];
    */
        //this.photoSwipe.openGallery(images,index);
        console.log('i is :' + i);
        console.log('j is :' + j);
        this.photoSwipe.openGallery(this.carsObjects[i].images, j);
    };
    CarItemComponent.prototype.getCarsThumbnail = function () {
        //console.log("the lord of the ring " );
        //  let im=[];
        this.carsObjects = [];
        var gofiForGallery = [];
        var gofThumbsForShow = [];
        // var arr = input.split(',');
        //console.log("length;"+this.pagedItems.length);
        for (var i = 0; i < this.pagedItems.length; i++) {
            var gofi = this.pagedItems[i].gofi;
            // if (gofi) var Gofi = gofi.split(','); else Gofi = [];
            if (gofi)
                var Gofi = gofi;
            else
                Gofi = [];
            // console.log(arr[0]);
            for (var j = 0; j < Gofi.length; j++) {
                var thumbForShow = Gofi[j];
                var imgUrl = Gofi[j].replace("_thumb", "");
                console.log("description is : " + this.pagedItems[i].details);
                var iForGallery = { thumb: thumbForShow, src: imgUrl, w: 1200, h: 900, title: this.pagedItems[i].details };
                // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
                gofThumbsForShow.push(thumbForShow);
                gofiForGallery.push(iForGallery);
                // obj=null;
            }
            /*  console.log("gofThumbsForShow lengh:"+gofThumbsForShow[i]);
             console.log("gofiForGallery lengh:"+gofiForGallery[i].src); */
            console.log('price is ' + this.pagedItems[i].price);
            var carObject = {
                id: this.pagedItems[i].ref_app_id,
                thums: gofThumbsForShow, images: gofiForGallery,
                manufacture: this.pagedItems[i].manufacture_name,
                model: this.pagedItems[i].model_name,
                color: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertIntToColor(this.pagedItems[i].color),
                city: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertIntToCity(this.pagedItems[i].emirate),
                date: this.pagedItems[i].ddate,
                kilometers: this.pagedItems[i].miles,
                price: this.pagedItems[i].price,
                year: this.pagedItems[i].year,
                specs: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertIntToSpecs(this.pagedItems[i].specs),
                warranty: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertIntToWaranty(this.pagedItems[i].waranty),
                transmission: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertIntToTransmission(this.pagedItems[i].transmission),
                cylinder: this.pagedItems[i].cylinders,
                phone: this.pagedItems[i].phone
            };
            this.carsObjects.push(carObject);
            gofiForGallery = [];
            gofThumbsForShow = [];
            //  ims.push({'app_id':this.pagedItems[i]},im);
            //  console.log(ims[0]);
            //this.photoSwipe.openGallery(images,index);
            // this.photoSwipe.openGallery(this.pagedItems,index);
        }
    };
    CarItemComponent.prototype.showPhone = function (phone, event) {
        //alert('phone is +'+JSON.stringify($event.target));
        var target = event.target || event.srcElement;
        target.innerHTML = phone;
        // alert ( target.innerHTML ); 
        //$event.target.inner
    };
    CarItemComponent.prototype.getCars = function (toSearch, offset) {
        var _this = this;
        /*  this.allItems =[];
         this.pagedItems =[];
         this.pager.pages = []; */
        //  var toSearch = {model:model,color:color}
        var offsetObject = { 'offset': offset };
        //var Count =  {'count': count};
        Object.assign(toSearch, offsetObject);
        var sort;
        switch (this.SortBy) {
            case 'Price lowest to highest': {
                sort = "APrice";
                break;
            }
            case 'Price highest to lowest': {
                sort = "DPrice";
                break;
            }
            case 'Date': {
                sort = "Date";
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
        var Sortby = { 'sortby': sort };
        // console.log('aaaaaaaa: '+Sortby.sortby)
        Object.assign(toSearch, Sortby);
        this.dataService.getCImages(toSearch)
            .subscribe(function (cars) {
            var a = cars.slice(0, 1);
            _this.count = a[0].count;
            console.log("count is :" + _this.count);
            _this.allItems = cars.slice(1, cars.length);
            _this.currentOffset = offset;
            //if(this.firstTime == true )this.setPage(1);
            // if (! (toSearch.offset>1)) {
            //   if (this.currentOffset != toSearch.offset){
            if (_this.allItems.length > 0) {
                _this.setPage(_this.currentPage);
            }
            else {
                _this.carsObjects = [];
            }
            //this.setPage(1);
            //this.firstTime = false;
            //  this.getCarsThumbnail();
            //  }
            //  this.setPage(this.currentPage);
        });
    };
    CarItemComponent.prototype.SearchCar = function (SearchFrm) {
        //console.log('car id is :' + this.selectedCar.APPLICATION_ID);
        this.carsObjects = [];
        var minYear = (this.slider3.getValue())[0];
        var maxYear = (this.slider3.getValue())[1];
        var minKilo = this.slider2.getValue()[0] * 1000;
        var maxKilo = this.slider2.getValue()[1] * 1000;
        var minPrice = this.slider1.getValue()[0] * 1000;
        var maxPrice = this.slider1.getValue()[1] * 1000;
        //alert(SearchFrm.value.manufacturerToSearch+' +' +SearchFrm.value.modelToSearch+' '+SearchFrm.value.cityToSearch);
        this.CityToSearch = SearchFrm.value.cityToSearch;
        this.ManufacturerToSearch = SearchFrm.value.manufacturerToSearch;
        this.ModelToSearch = SearchFrm.value.modelToSearch;
        var toSearch = {
            city: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertCitytoInt(SearchFrm.value.cityToSearch),
            manufacturer: SearchFrm.value.manufacturerToSearch,
            model: SearchFrm.value.modelToSearch,
            color: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertColorToInt(SearchFrm.value.colorToSearch),
            minYear: minYear,
            maxYear: maxYear,
            minKilo: minKilo,
            maxKilo: maxKilo,
            minPrice: minPrice,
            maxPrice: maxPrice,
            cylinder: SearchFrm.value.cylinderToSearch,
            specification: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertSpecsToInt(SearchFrm.value.specificationToSearch),
            transmission: _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].convertTransmissionToInt(SearchFrm.value.transmissionToSearch),
        };
        console.log('manufatures to search : ' + JSON.stringify(toSearch));
        this.currentPage = 1;
        this.toSearch = toSearch;
        this.getCars(this.toSearch, 0);
    };
    CarItemComponent.prototype.resetSearch = function (all) {
        switch (all) {
            case 'allCiteis': {
                this.toSearch.city = '';
                this.CityToSearch = '';
                this.toSearch.manufacturer = '';
                this.ManufacturerToSearch = '';
                this.toSearch.model = '';
                this.ModelToSearch = '';
                this.getCars(this.toSearch, 0);
                break;
            }
            case 'AllManufacturer': {
                this.toSearch.manufacturer = '';
                this.ManufacturerToSearch = '';
                this.toSearch.model = '';
                this.ModelToSearch = '';
                this.getCars(this.toSearch, 0);
                break;
            }
            case 'AllModel': {
                this.toSearch.model = '';
                this.getCars(this.toSearch, 0);
                this.ModelToSearch = '';
                break;
            }
        }
    };
    CarItemComponent.prototype.onSortByChange = function (newValue) {
        // console.log(newValue);
        this.SortBy = newValue;
        this.getCars(this.toSearch, 0);
        // ... do other stuff here ...
    };
    CarItemComponent.prototype.onManufacturersChange = function (event) {
        var _this = this;
        console.log('manufatrer chaned' + JSON.stringify(event));
        if (event != '' && event != 'All') {
            this.showModel = true;
            this.dataService.getModels(event)
                .subscribe(function (models) { _this.ModelsObject = models; });
        }
        else {
            this.showModel = false;
        }
    };
    CarItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getManufacturers()
            .subscribe(function (manufacturers) {
            _this.ManufacturersObject = manufacturers;
            console.log('manucaturers : ' + JSON.stringify(manufacturers));
        });
        this.getCars(this.toSearch, 0);
        /*   var slider = new Slider("#ex1", {
            id: "slider1",
            tooltip: 'always',
         
        }); */
        this.slider1 = new Slider("#price", {
            id: "slider2",
            /*    tooltip: 'always', */
            tooltip_position: 'bottom',
            ticks: [0, 100],
            ticks_labels: [' 0k', '≥100k'],
        });
        /* slider1.on("click", function(sliderValue) {
            alert(sliderValue);
        }); */
        this.slider2 = new Slider("#kilo", {
            id: "slider3",
            /* tooltip: 'always', */
            tooltip_position: 'bottom',
            ticks: [0, 200],
            ticks_labels: [' 0k', '≥200k']
            /*   ticks_snap_bounds: 30 */
        });
        this.slider3 = new Slider("#year", {
            id: "slider4",
            tooltip_position: 'bottom',
            ticks: [1990, 2018],
            ticks_labels: ['≤1990', '2018'],
            ticks_snap_bounds: 5
        });
        /*  var sliderC = new Slider("#ex12c", { id: "slider12c", min: 0, max: 10, range: true, value: [3, 7] }); */
        this.translate.onLangChange.subscribe(function (event) {
            _this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_3__["Utils"].toggleLanguage;
            // do something
        });
    };
    CarItemComponent.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        //this.im = [];
        this.currentPage = page;
        var offset = Math.floor((page - 1) / 10) * 100;
        if (offset != this.currentOffset) {
            //var toSearch= { offset:offset};
            this.getCars(this.toSearch, offset);
            return;
        }
        // this.pager = this.pagerService.getPager(this.allItems.length, page);   //count(*)
        this.pager = this.pagerService.getPager(this.count, page, 10);
        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex - offset, this.pager.endIndex + 1 - offset);
        this.getCarsThumbnail();
        // console.log("paged items:"+this.pagedItems[0].REF_APP_ID);
        console.log("all  is : " + this.allItems.length);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('photoSwipe'),
        __metadata("design:type", _photo_swipe_photo_swipe_component__WEBPACK_IMPORTED_MODULE_5__["PhotoSwipeComponent"])
    ], CarItemComponent.prototype, "photoSwipe", void 0);
    CarItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-car-item',
            template: __webpack_require__(/*! ./car-item.component.html */ "./src/app/car-item/car-item.component.html"),
            styles: [__webpack_require__(/*! ./car-item.component.css */ "./src/app/car-item/car-item.component.css")],
            providers: [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _services_index__WEBPACK_IMPORTED_MODULE_2__["PagerService"], _data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"]])
    ], CarItemComponent);
    return CarItemComponent;
}());



/***/ }),

/***/ "./src/app/contact/contact.component.css":
/*!***********************************************!*\
  !*** ./src/app/contact/contact.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/contact/contact.component.html":
/*!************************************************!*\
  !*** ./src/app/contact/contact.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  contact works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/contact/contact.component.ts":
/*!**********************************************!*\
  !*** ./src/app/contact/contact.component.ts ***!
  \**********************************************/
/*! exports provided: ContactComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactComponent", function() { return ContactComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContactComponent = /** @class */ (function () {
    function ContactComponent() {
    }
    ContactComponent.prototype.ngOnInit = function () {
    };
    ContactComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-contact',
            template: __webpack_require__(/*! ./contact.component.html */ "./src/app/contact/contact.component.html"),
            styles: [__webpack_require__(/*! ./contact.component.css */ "./src/app/contact/contact.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ContactComponent);
    return ContactComponent;
}());



/***/ }),

/***/ "./src/app/core/auth.service.ts":
/*!**************************************!*\
  !*** ./src/app/core/auth.service.ts ***!
  \**************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/index.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var rxjs_add_operator_switchMap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/add/operator/switchMap */ "./node_modules/rxjs/_esm5/add/operator/switchMap.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthService = /** @class */ (function () {
    /* constructor(private afAuth: AngularFireAuth,
                 private afs: AngularFirestore,
                 private router:Router) {
   
               this.afAuth.authState.subscribe((auth) => {
                 this.authState = auth
               });
                 }*/
    //    user: Observable<User>;
    function AuthService(afAuth, 
        //  private afs: AngularFirestore,
        router) {
        this.afAuth = afAuth;
        this.router = router;
        this.authState = null;
        //// Get auth data, then get firestore user document || null
        this.user = this.afAuth.authState;
        /*  .switchMap(user => {
           if (user) {
             return this.afs.doc<User>(`users/${user.uid}/userInfo/user`).valueChanges()
           } else {
             return Observable.of(null)
           }
         }) */
    }
    Object.defineProperty(AuthService.prototype, "authenticated", {
        // Returns true if user is logged in
        get: function () {
            return this.authState !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUser", {
        // Returns current user data
        get: function () {
            return this.authenticated ? this.authState : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserObservable", {
        // Returns
        get: function () {
            return this.afAuth.authState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserId", {
        // Returns current user UID
        get: function () {
            return this.authenticated ? this.authState.uid : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserAnonymous", {
        // Anonymous User
        get: function () {
            return this.authenticated ? this.authState.isAnonymous : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserDisplayName", {
        // Returns current user display name or Guest
        get: function () {
            if (!this.authState) {
                return 'Guest';
            }
            else if (this.currentUserAnonymous) {
                return 'Anonymous';
            }
            else {
                return 'User without a Name';
            }
        },
        enumerable: true,
        configurable: true
    });
    //// Social Auth ////
    AuthService.prototype.githubLogin = function () {
        var provider = new firebase_app__WEBPACK_IMPORTED_MODULE_2__["auth"].GithubAuthProvider();
        //const provider2 = new firebase.app().auth().GithubAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.googleLogin = function () {
        var provider = new firebase_app__WEBPACK_IMPORTED_MODULE_2__["auth"].GoogleAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.facebookLogin = function () {
        var provider = new firebase_app__WEBPACK_IMPORTED_MODULE_2__["auth"].FacebookAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.twitterLogin = function () {
        var provider = new firebase_app__WEBPACK_IMPORTED_MODULE_2__["auth"].TwitterAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.socialSignIn = function (provider) {
        var _this = this;
        return this.afAuth.auth.signInWithPopup(provider)
            .then(function (credential) {
            _this.authState = credential.user;
            //      this.updateUserData()
            _this.router.navigate(['/members']);
        })
            .catch(function (error) { return alert(error); });
    };
    //// Anonymous Auth ////
    AuthService.prototype.anonymousLogin = function () {
        var _this = this;
        return this.afAuth.auth.signInAnonymously()
            .then(function (user) {
            _this.authState = user;
            //       this.updateUserData()
        })
            .catch(function (error) { return console.log(error); });
    };
    //// Email/Password Auth ////
    AuthService.prototype.emailSignUp = function (email, password) {
        var _this = this;
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {
            _this.authState = user;
            //      this.updateUserData()
        })
            .catch(function (error) { return alert(error); });
    };
    AuthService.prototype.emailLogin = function (email, password) {
        var _this = this;
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(function (user) {
            _this.authState = user;
            //     this.updateUserData()
        })
            .catch(function (error) { return alert(error); });
    };
    // Sends email allowing user to reset password
    AuthService.prototype.resetPassword = function (email) {
        //var auth = firebase.auth();
        return this.afAuth.auth.sendPasswordResetEmail(email)
            .then(function () { return alert("email sent"); })
            .catch(function (error) { return alert(error); });
    };
    //// Sign Out ////
    AuthService.prototype.signOut = function () {
        var _this = this;
        this.afAuth.auth.signOut().then(function () {
            _this.router.navigate(['/login']);
        });
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [angularfire2_auth__WEBPACK_IMPORTED_MODULE_3__["AngularFireAuth"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/data.service.ts":
/*!*********************************!*\
  !*** ./src/app/data.service.ts ***!
  \*********************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs/_esm5/add/operator/map.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

//import {HttpClient, Response, Headers} from '@angular/common/http'


var DataService = /** @class */ (function () {
    // hostName:string  = "http://localhost:8080/";
    function DataService(http) {
        this.http = http;
    }
    /*getCarsImages(){
      return this.http.get<Array<car>>("http://localhost:3000/api/carsimgs")
      //.map(res => res.json())
    }*/
    DataService.prototype.getCImages = function (toSearch) {
        return this.http.get(/* this.hostName +*/ "api/cimages", {
            params: toSearch /* {
              model: model ,
              color: color,
              userID: userID
            } */
            //.map(res => res.json())
        });
    };
    DataService.prototype.getManufacturers = function () {
        return this.http.get(/* this.hostName +*/ "api/manufacturers");
    };
    DataService.prototype.getModels = function (Manufacturer) {
        return this.http.get(/* this.hostName+ */ "api/models", {
            params: { manufacturer: Manufacturer }
        });
    };
    DataService.prototype.deleteCar = function (id) {
        return this.http.delete(/* this.hostName+ */ "api/car/" + id);
        // .map(res => res.json());
    };
    DataService.prototype.deleteImage = function (image_url) {
        var image_name = image_url.substring(22);
        console.log('image name is ' + image_name + "image url is " + image_url);
        return this.http.delete(/* this.hostName+ */ "api/image/" + image_name);
        // .map(res => res.json());
    };
    DataService.prototype.updateCar = function (carID, formData) {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
        headers.append('content-type', 'application/json');
        /*  return this.http.put<car>("http://localhost:3000/api/car/"+carID, car, {headers:headers}) */
        return this.http.put(/* this.hostName+ */ "api/car/" + carID, formData, { headers: headers });
        //.map( res => res.json());
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/file-drop.directive.ts":
/*!****************************************!*\
  !*** ./src/app/file-drop.directive.ts ***!
  \****************************************/
/*! exports provided: FileDropDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileDropDirective", function() { return FileDropDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FileDropDirective = /** @class */ (function () {
    function FileDropDirective() {
        this.filesDropped = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.filesHovered = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    FileDropDirective.prototype.onDrop = function ($event) {
        $event.preventDefault();
        var transfer = $event.dataTransfer;
        //let transfer = $event.tar;
        this.filesDropped.emit(transfer.files);
        this.filesHovered.emit(false);
    };
    FileDropDirective.prototype.onDragOver = function ($event) {
        event.preventDefault();
        this.filesHovered.emit(true);
    };
    FileDropDirective.prototype.onDragLeave = function ($event) {
        this.filesHovered.emit(false);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], FileDropDirective.prototype, "filesDropped", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], FileDropDirective.prototype, "filesHovered", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('drop', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FileDropDirective.prototype, "onDrop", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('dragover', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FileDropDirective.prototype, "onDragOver", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('dragleave', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FileDropDirective.prototype, "onDragLeave", null);
    FileDropDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[fileDrop]'
        }),
        __metadata("design:paramtypes", [])
    ], FileDropDirective);
    return FileDropDirective;
}());



/***/ }),

/***/ "./src/app/footer/footer.component.css":
/*!*********************************************!*\
  !*** ./src/app/footer/footer.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "hr {\r\n    \r\n   /*  clear:both;\r\n    display:block;\r\n    color: black;*/\r\n    height: 4px; \r\n    display: block;\r\n    margin-top: 0.5em;\r\n    margin-bottom: 0.5em;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    border-style: inset;\r\n    \r\n  }\r\n\r\n  .text-center{\r\n      text-align: left;\r\n   \r\n  }\r\n\r\n  footer {\r\n      background-color:  rgb(3, 17, 31); \r\n  }\r\n\r\n  .footerUp{\r\n    color: rgba(241, 237, 237, 0.637);\r\n    font-family: ubuntu;\r\n    \r\n  }\r\n\r\n  a{\r\n    /* color:rgba(34, 137, 228, 0.808) */\r\n    color:rgba(34, 137, 228, 0.808)\r\n  }\r\n\r\n  a:hover{\r\n   \r\n\tfont-style: italic;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n\r\n  .toggleLang{\r\n    text-align: right;\r\n    direction: rtl;\r\n}"

/***/ }),

/***/ "./src/app/footer/footer.component.html":
/*!**********************************************!*\
  !*** ./src/app/footer/footer.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = " \r\n\r\n\r\n<footer  class=\"page-footer cent font-small mdb-color pt-4\">\r\n  \r\n  <!-- Footer Links -->\r\n  <div class=\"container text-center text-md-left\" [class.toggleLang]=\"toggleLanguage\">\r\n\r\n    <!-- Footer links -->\r\n    <div class=\"row footerUp\">\r\n        <br>\r\n\r\n       \r\n        \r\n      <div class=\"col-md-1\"> </div>\r\n      <!-- Grid column -->\r\n      <div class=\"col-md-4\"> \r\n        <h6 class=\"text-uppercase mb-4 font-weight-bold\"><b translate>CompanyName</b></h6>\r\n        <p translate>OurCompany</p>\r\n      </div>\r\n      <!-- Grid column -->\r\n\r\n    <!--   <hr class=\"w-100 clearfix d-md-none\"> -->\r\n\r\n      <!-- Grid column -->\r\n     <!--  <div class=\"col-md-2\"> \r\n      \r\n      </div> -->\r\n      <!-- Grid column -->\r\n\r\n  <!--     <hr class=\"w-100 clearfix d-md-none\"> -->\r\n\r\n      <!-- Grid column -->\r\n      <div class=\"col-md-2\"> \r\n        <h6 class=\"text-uppercase mb-4 font-weight-bold\"><b translate>UsefulLinks</b></h6>\r\n        <p>\r\n           Your Account \r\n        <p>\r\n           Become an Affiliate \r\n        </p>\r\n       \r\n      \r\n        \r\n  \r\n        <p>\r\n          Shipping Rates \r\n        </p>\r\n        <p translate>\r\n            Help \r\n        </p>\r\n      </div>\r\n\r\n      <!-- Grid column -->\r\n  <!--     <hr class=\"w-100 clearfix d-md-none\"> -->\r\n\r\n      <!-- Grid column -->\r\n      <div class=\"text-primary\" class=\"col-md-1\"> \r\n        <h6 class=\"text-uppercase \"> <b translate>Language</b></h6>\r\n        <p>\r\n          <a style=\"color: rgba(241, 237, 237, 0.637);\" (click)=\"switchLanguage('ar')\"  >العربية </a></p>\r\n        <p>\r\n          <a style=\"color: rgba(241, 237, 237, 0.637);\" (click)=\"switchLanguage('en')\"  > English</a></p>\r\n         \r\n         \r\n      </div>\r\n      \r\n\r\n\r\n\r\n      <div class=\"text-primary\" class=\"col-md-3\"> \r\n        <h6 class=\"text-uppercase \"> <b translate>Contact</b></h6>\r\n        <p>\r\n          <i class=\"fa fa-home mr-3\"></i> Dubai, International City, AE</p>\r\n        <p>\r\n          <i class=\"fa fa-envelope mr-3\"></i> sudanamin@hotmail.com</p>\r\n        <p>\r\n          <i class=\"fa fa-phone mr-3\"></i> + 971 522 626 202</p>\r\n        <p>\r\n            <i class=\"fa fa-whatsapp\"  ></i> + 971 522 626 202</p>\r\n      </div>\r\n      <!-- Grid column -->\r\n     \r\n    </div>\r\n    <!-- Footer links -->\r\n\r\n    <br>\r\n<div class='row' style='color:rgba(34, 137, 228, 0.808)'>    <!-- rgb(83, 156, 219) (34, 137, 228, 0.808)-->\r\n    <div class=\"col-md-2  \"></div>\r\n    <div class=\"col-md-1  \" translate> <b class=\"text-uppercase mb-4 font-weight-bold\" translate> Emirate</b>  \r\n    </div>\r\n      <div class=\"col-md-1 \" translate>\r\n         <a>AbuDhabi </a>   \r\n    </div>\r\n    <div class=\"col-md-1  \" translate>  <a> Ajman</a> \r\n      </div>\r\n      <div class=\"col-md-1 \" translate>\r\n         <a>Alain </a> \r\n        </div>\r\n    <div class=\"col-md-1  \" translate>  \r\n           <a>Dubai</a>\r\n          \r\n      </div>\r\n      <div class=\"col-md-1  \" translate>\r\n         <a> Fujaira   </a>     \r\n       </div>\r\n\r\n    <div class=\"col-md-3  \"> \r\n      <div class='row'>\r\n    <div class=col-md-6 translate> \r\n    <a> RasAlkaima </a>\r\n  </div>\r\n  <div class=col-md-6 > <a>UmmAlquwain</a></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"col-md-2  \" >  \r\n       \r\n      </div>\r\n    \r\n   \r\n     \r\n       \r\n \r\n</div>\r\n    \r\n<hr>\r\n    <!-- Grid row -->\r\n    <div class=\"row   align-items-center\"  style='direction: ltr'> \r\n\r\n      <!-- Grid column -->\r\n     <!--  <div class=\"col-md-1  \"></div> -->\r\n     <div class=\"col-md-10  \">\r\n\r\n        <!--Copyright-->\r\n        <p class=\"text-center text-md-left\"><span class='footerUp'>© Copyright:</span>\r\n          <a href=\"https://mdbootstrap.com/bootstrap-tutorial/\">\r\n            <strong style=\"color: goldenrod\" > zezenia.ae </strong>\r\n             \r\n          </a><span class='footerUp'>2018,</span> \r\n          <br>\r\n          <span class='footerUp'>All Rights Reserved.</span>  \r\n        </p>\r\n\r\n      </div>\r\n      <!-- Grid column -->\r\n\r\n      <!-- Grid column -->\r\n      <div class=\"col-md-2 \">\r\n      <div class='row' style='direction: ltr'>\r\n        <!-- Social buttons -->\r\n        <div class=\"text-center text-md-right\">\r\n          <ul class=\"list-unstyled list-inline\">\r\n            <li class=\"list-inline-item\">\r\n              <a  href='http://www.fb.com' class=\"btn-floating btn-sm rgba-white-slight mx-1\">\r\n                <i class=\"fa fa-facebook\" style=\" color:rgba(67, 137, 230, 0.897)\"></i>\r\n              </a>\r\n            </li>\r\n            <li   class=\"list-inline-item\">\r\n              <a href='http://web.whatsapp.com' class=\"btn-floating btn-sm rgba-white-slight mx-1\">\r\n                  <i class=\"fa fa-whatsapp\" style=\" color:rgba(0, 128, 0, 0.788)\"></i>\r\n              </a>\r\n            </li>\r\n            <li class=\"list-inline-item\">\r\n              <a href='http://www.google.com' class=\"btn-floating btn-sm rgba-white-slight mx-1\">\r\n                <i class=\"fa fa-google-plus\" style=\" color:rgba(202, 6, 6, 0.61)\"></i>\r\n              </a>\r\n            </li>\r\n            <li class=\"list-inline-item\">\r\n              <a href='http://www.google.com' class=\"btn-floating btn-sm rgba-white-slight mx-1\">\r\n                <i class=\"fa fa-linkedin\"  style=\" color:white\"></i>\r\n              </a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n      </div>\r\n      <!-- Grid column -->\r\n\r\n    </div>\r\n    <!-- Grid row -->\r\n\r\n  </div>\r\n  <!-- Footer Links -->\r\n\r\n</footer>\r\n<!-- Footer -->"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/@ngx-translate/core.es5.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./src/util.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FooterComponent = /** @class */ (function () {
    function FooterComponent(translate) {
        this.translate = translate;
        this.toggleLanguage = false;
        translate.setDefaultLang('en');
    }
    FooterComponent.prototype.switchLanguage = function (language) {
        // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
        _util__WEBPACK_IMPORTED_MODULE_2__["Utils"].toggleLanguage = !_util__WEBPACK_IMPORTED_MODULE_2__["Utils"].toggleLanguage;
        this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_2__["Utils"].toggleLanguage;
        if (_util__WEBPACK_IMPORTED_MODULE_2__["Utils"].toggleLanguage == true)
            this.translate.use('ar');
        else
            this.translate.use('en');
    };
    FooterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translate.onLangChange.subscribe(function (event) {
            _this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_2__["Utils"].toggleLanguage;
            // do something
        });
    };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! ./footer.component.html */ "./src/app/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.css */ "./src/app/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"]])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a:hover{\r\n\t \r\n\tfont-style: italic;\r\n\ttext-decoration: none;\r\n}\r\n\r\na{\r\n\tcolor:white;\r\n\t\r\n}\r\n\r\nimg {\r\n\t\tborder:1px solid rgb(152, 207, 23);\r\n\t\tborder-radius:6px;\r\n\t\t/* box-sizing:border-box; */\r\n\t\tmargin-left: auto;\r\n\t\tmargin-top: 9px;\r\n    margin-right: auto;\r\n\t\theight:90px;\r\n\t\tdisplay:block;\r\n \r\n\t\t/* margin-left: -(half ot the image width)px */\r\n\t/*top: 10%;\r\n\tleft: 10%; */\r\n\t  }\r\n\r\n.btn-si {\r\n\t\tbackground-position: 1em;\r\n\t\tbackground-repeat: no-repeat;\r\n\t\tbackground-size: 2em;\r\n\t\tborder-radius: 0.5em;\r\n\t\tborder: none;\r\n\t\tcolor: rgba(184, 207, 228, 0.877);\r\n\t\tcursor: pointer;\r\n\t\tfont-size: 1em;\r\n\t\theight: 2em;\r\n\t\tline-height: 1em;\r\n\t\tpadding: 0 2em 0 3em;\r\n\t\ttext-decoration: none;\r\n\t\ttransition: all 0.5s; }\r\n\r\n/*google button */\r\n\r\n.btn-google {\r\n\t\tbackground-color: #d863549d;\r\n\t\tbackground-image: url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 %3F%3E%3C!DOCTYPE svg  PUBLIC '-%2F%2FW3C%2F%2FDTD SVG 1.1%2F%2FEN'  'http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd'%3E%3Csvg enable-background%3D%22new 0 0 400 400%22 height%3D%22400px%22 id%3D%22Layer_1%22 version%3D%221.1%22 viewBox%3D%220 0 400 400%22 width%3D%22400px%22 xml%3Aspace%3D%22preserve%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cg%3E%3Cpath d%3D%22M142.9%2C24.2C97.6%2C39.7%2C59%2C73.6%2C37.5%2C116.5c-7.5%2C14.8-12.9%2C30.5-16.2%2C46.8c-8.2%2C40.4-2.5%2C83.5%2C16.1%2C120.3   c12.1%2C24%2C29.5%2C45.4%2C50.5%2C62.1c19.9%2C15.8%2C43%2C27.6%2C67.6%2C34.1c31%2C8.3%2C64%2C8.1%2C95.2%2C1c28.2-6.5%2C54.9-20%2C76.2-39.6   c22.5-20.7%2C38.6-47.9%2C47.1-77.2c9.3-31.9%2C10.5-66%2C4.7-98.8c-58.3%2C0-116.7%2C0-175%2C0c0%2C24.2%2C0%2C48.4%2C0%2C72.6c33.8%2C0%2C67.6%2C0%2C101.4%2C0   c-3.9%2C23.2-17.7%2C44.4-37.2%2C57.5c-12.3%2C8.3-26.4%2C13.6-41%2C16.2c-14.6%2C2.5-29.8%2C2.8-44.4-0.1c-14.9-3-29-9.2-41.4-17.9   c-19.8-13.9-34.9-34.2-42.6-57.1c-7.9-23.3-8-49.2%2C0-72.4c5.6-16.4%2C14.8-31.5%2C27-43.9c15-15.4%2C34.5-26.4%2C55.6-30.9   c18-3.8%2C37-3.1%2C54.6%2C2.2c15%2C4.5%2C28.8%2C12.8%2C40.1%2C23.6c11.4-11.4%2C22.8-22.8%2C34.2-34.2c6-6.1%2C12.3-12%2C18.1-18.3   c-17.3-16-37.7-28.9-59.9-37.1C228.2%2C10.6%2C183.2%2C10.3%2C142.9%2C24.2z%22 fill%3D%22%23FFFFFF%22%2F%3E%3Cg%3E%3Cpath d%3D%22M142.9%2C24.2c40.2-13.9%2C85.3-13.6%2C125.3%2C1.1c22.2%2C8.2%2C42.5%2C21%2C59.9%2C37.1c-5.8%2C6.3-12.1%2C12.2-18.1%2C18.3    c-11.4%2C11.4-22.8%2C22.8-34.2%2C34.2c-11.3-10.8-25.1-19-40.1-23.6c-17.6-5.3-36.6-6.1-54.6-2.2c-21%2C4.5-40.5%2C15.5-55.6%2C30.9    c-12.2%2C12.3-21.4%2C27.5-27%2C43.9c-20.3-15.8-40.6-31.5-61-47.3C59%2C73.6%2C97.6%2C39.7%2C142.9%2C24.2z%22 fill%3D%22%23EA4335%22%2F%3E%3C%2Fg%3E%3Cg%3E%3Cpath d%3D%22M21.4%2C163.2c3.3-16.2%2C8.7-32%2C16.2-46.8c20.3%2C15.8%2C40.6%2C31.5%2C61%2C47.3c-8%2C23.3-8%2C49.2%2C0%2C72.4    c-20.3%2C15.8-40.6%2C31.6-60.9%2C47.3C18.9%2C246.7%2C13.2%2C203.6%2C21.4%2C163.2z%22 fill%3D%22%23FBBC05%22%2F%3E%3C%2Fg%3E%3Cg%3E%3Cpath d%3D%22M203.7%2C165.1c58.3%2C0%2C116.7%2C0%2C175%2C0c5.8%2C32.7%2C4.5%2C66.8-4.7%2C98.8c-8.5%2C29.3-24.6%2C56.5-47.1%2C77.2    c-19.7-15.3-39.4-30.6-59.1-45.9c19.5-13.1%2C33.3-34.3%2C37.2-57.5c-33.8%2C0-67.6%2C0-101.4%2C0C203.7%2C213.5%2C203.7%2C189.3%2C203.7%2C165.1z%22 fill%3D%22%234285F4%22%2F%3E%3C%2Fg%3E%3Cg%3E%3Cpath d%3D%22M37.5%2C283.5c20.3-15.7%2C40.6-31.5%2C60.9-47.3c7.8%2C22.9%2C22.8%2C43.2%2C42.6%2C57.1c12.4%2C8.7%2C26.6%2C14.9%2C41.4%2C17.9    c14.6%2C3%2C29.7%2C2.6%2C44.4%2C0.1c14.6-2.6%2C28.7-7.9%2C41-16.2c19.7%2C15.3%2C39.4%2C30.6%2C59.1%2C45.9c-21.3%2C19.7-48%2C33.1-76.2%2C39.6    c-31.2%2C7.1-64.2%2C7.3-95.2-1c-24.6-6.5-47.7-18.2-67.6-34.1C67%2C328.9%2C49.6%2C307.5%2C37.5%2C283.5z%22 fill%3D%22%2334A853%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\r\n\t\tborder-radius: 20px;\r\n\t\twidth: 100%;\r\n\t}\r\n\r\n.btn-google:hover {\r\n\t\t\tbackground: white; \r\n\t\t\tcolor: #59685f;}\r\n\r\n.btn-google:active {\r\n\t\t  background-color: #c23321; }\r\n\r\n/*facebook button */\r\n\r\n.btn-facebook {\r\n\t\t/* padding: 50% 0; */\r\n\t\tvertical-align: middle;\r\n\t\t\tbackground-color: #5876da6b;\r\n\t\t\tbackground-image: url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22iso-8859-1%22%3F%3E%0D%3C!-- Generator%3A Adobe Illustrator 18.0.0%2C SVG Export Plug-In . SVG Version%3A 6.00 Build 0)  --%3E%0D%3C!DOCTYPE svg PUBLIC %22-%2F%2FW3C%2F%2FDTD SVG 1.1%2F%2FEN%22 %22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%3Csvg version%3D%221.1%22 id%3D%22Capa_1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22 x%3D%220px%22 y%3D%220px%22%0D%09 viewBox%3D%220 0 112.196 112.196%22 style%3D%22enable-background%3Anew 0 0 112.196 112.196%3B%22 xml%3Aspace%3D%22preserve%22%3E%0D%3Cg%3E%0D%09%3Ccircle style%3D%22fill%3A%233B5998%3B%22 cx%3D%2256.098%22 cy%3D%2256.098%22 r%3D%2256.098%22%2F%3E%0D%09%3Cpath style%3D%22fill%3A%23FFFFFF%3B%22 d%3D%22M70.201%2C58.294h-10.01v36.672H45.025V58.294h-7.213V45.406h7.213v-8.34%0D%09%09c0-5.964%2C2.833-15.303%2C15.301-15.303L71.56%2C21.81v12.51h-8.151c-1.337%2C0-3.217%2C0.668-3.217%2C3.513v7.585h11.334L70.201%2C58.294z%22%2F%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3Cg%3E%0D%3C%2Fg%3E%0D%3C%2Fsvg%3E%0D\");\r\n\t\t\tborder-radius: 20px;\r\n\t\t\twidth: 100%;\r\n\t\t}\r\n\r\n.btn-facebook:hover {\r\n\t\t\t\tbackground: white;\r\n\t\t\t\tcolor: #59685f;}\r\n\r\n.btn-facebook:active {\r\n\t\t\t  background-color: #c23321; }\r\n\r\n.tab{\r\n\tbackground-color: rgb(3, 17, 31);\r\n\t\t\t\toverflow: auto;\r\n\t\t\t\t\r\n\t\t\t}\r\n\r\n.loginBox\r\n{\r\n\t/* position: absolute; */\r\n\t/* top: 50%;\r\n\tleft: 50%; */\r\n\t/* transform: translate(-50%,-50%); */\r\n\t/* width: 350px; */\r\n\t/*/height: 80%; */\r\n\tpadding: 60px 30px;\r\n\tmargin-top: 35px;\r\n\tbox-sizing: border-box;\r\n\tbackground-color: rgba(10, 26, 58, 0.719);\r\n}\r\n\r\n.login{\r\n  \r\n    float: left;\r\n    text-align: left;\r\n    \r\n\tcolor: rgba(184, 207, 228, 0.877);\r\n\t\r\n    font-family:ubuntu;\r\n    }\r\n\r\n.lang{\r\n    float: right;\r\n    text-align: left;\r\n   \r\n\tfont-size: medium;\r\n\tfont-weight: bold;\r\n\t\r\n\tfont-family:ubuntu;\r\n\t\r\n    /* float : left ; */\r\n}\r\n\r\n.about{\r\n    float: left;\r\n    text-align: left;\r\n     font-size: medium;\r\n    color: white;\r\n    font-family:ubuntu;\r\n}\r\n\r\n.fontUbuntu{\r\n\t font-family : Ubuntu;\r\n\t \r\n\t \r\n}\r\n\r\n.user\r\n{\r\n\topacity: 0.9;\r\n\twidth: 100px;\r\n\theight: 100px;\r\n\tborder-radius: 50%;\r\n\toverflow: hidden;\r\n\tposition: absolute;\r\n\ttop: calc(-100px/2);\r\n\tleft: calc(50% - 50px);\r\n}\r\n\r\nh4\r\n{\r\n\tmargin: 0;\r\n\tpadding: 0 0 20px;\r\n\tcolor: white;\r\n\ttext-align: center;\r\n}\r\n\r\n.loginBox p\r\n{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\tfont-weight: bold;\r\n\tcolor: rgba(184, 207, 228, 0.877);\r\n}\r\n\r\n.loginBox input\r\n{\r\n\twidth: 100%;\r\n\tmargin-bottom: 20px;\r\n}\r\n\r\n.loginBox input[type=\"text\"],\r\n.loginBox input[type=\"password\"]\r\n{\r\n\tborder: none;\r\n\tborder-bottom: 1px solid #fff;\r\n\tbackground: transparent;\r\n\toutline: none;\r\n\theight: 40px;\r\n\tcolor: #fff;\r\n\tfont-size: 16px;\r\n}\r\n\r\n.loginBox input[type=\"text\"]:hover,\r\n.loginBox input[type=\"password\"]:hover\r\n{\r\n\tborder-bottom: 1px solid greenyellow;\r\n\t/*color: #262626;*/\r\n}\r\n\r\n::-webkit-input-placeholder\r\n{\r\n\tcolor: rgba(255,255,255,.5);\r\n}\r\n\r\n:-ms-input-placeholder\r\n{\r\n\tcolor: rgba(255,255,255,.5);\r\n}\r\n\r\n::-ms-input-placeholder\r\n{\r\n\tcolor: rgba(255,255,255,.5);\r\n}\r\n\r\n::placeholder\r\n{\r\n\tcolor: rgba(255,255,255,.5);\r\n}\r\n\r\n.loginBox input[type=\"submit\"]\r\n{\r\n\tborder: none;\r\n\toutline: none;\r\n\theight: 2em;\r\n\tcolor: #fff;\r\n\tfont-size: 16px;\r\n\tbackground:   rgba(18, 24, 31, 0.877);\r\n\tcursor: pointer;\r\n\tborder-radius: 20px;\r\n}\r\n\r\n.loginBox input[type=\"submit\"]:hover\r\n{\r\n\tbackground: white;\r\n\tcolor: #59685f;\r\n}\r\n\r\n.loginBox a\r\n{\r\n\tcolor: rgba(184, 207, 228, 0.877);\r\n\tfont-size: 14px;\r\n\tfont-weight: bold;\r\n\ttext-decoration: none;\r\n\t\r\n}\r\n\r\n.play\r\n{\r\n\tmargin-top: 8px;\r\n\tcolor: rgb(152, 207, 23);\r\n\ttext-align: center;\r\n}\r\n"

/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div  *ngIf=\"auth.user | async; then loading else login\">here is ignored</div>\r\n\r\n<ng-template #login>\r\n<!--<div class=\"form-container \">\r\n <div class=\"form-container\">\r\n    <img src=\"assets/images/lock.svg\" id=\"lock\">   -->\r\n \r\n     <!-- <span class=\"error\" *ngIf=\"error\">{{ error }}</span>\r\n \r\n   <button (click)=\"auth.facebookLogin()\" id=\"fb\">Login With Facebook</button><br>\r\n   <br>\r\n   <br>\r\n   <button (click)=\"auth.googleLogin()\" id=\"google\" ><i class=\"fa fa-google\">Login With Google</i></button>\r\n   <br>\r\n   <br>\r\n   <button routerLink=\"/login-email\" id=\"email\">Email</button>\r\n\r\n   <br>\r\n   <br>\r\n \r\n   <a routerLink=\"/signup\" routerLinkActive=\"active\" class=\"alc\">No account? <strong>Create one here</strong></a>\r\n </div> -->\r\n \r\n <div class=\"tab\">\r\n  <div class=\"col-md-2\"> </div>\r\n  <div class=\"col-md-8\">\r\n\r\n      <br>\r\n      <div class='about' (click)= \"router.navigate(['/main'])\"> <a ><i class=\"fa fa-home\" style=\"font-size:normal;color:greenyellow\"></i>&nbsp;Home &nbsp;|</a></div>\r\n      <div class='about' (click)= \"router.navigate(['/about'])\"> &nbsp; <a style=\"color:white;\">About &nbsp;|</a> </div>\r\n      <div class='about' (click)= \"router.navigate(['/contact'])\"> &nbsp; <a style=\"color:white;\">Contact</a> </div>\r\n      \r\n      \r\n      \r\n      <div class='lang' > <a style=\"color: rgba(184, 207, 228, 0.877);\">العربية </a>&nbsp;&nbsp;</div>\r\n        <br> <br> \r\n  </div>\r\n  <div class=\"col-md-2\"> </div>\r\n</div>    \r\n\r\n<div class=\"row\"> </div>\r\n \r\n    <div class=\"row\"> \r\n<div class=\"col-md-4\"> </div>\r\n <div class=\"loginBox fontUbuntu mx-auto  col-md-3\">\r\n  \r\n  <h4 >Login here</h4>\r\n  <!-- <form> -->\r\n\r\n      <button (click)=\"auth.facebookLogin()\" id=\"fb\"  class=\"btn-si btn-facebook\">Login With Facebook</button><br>\r\n      <br>\r\n      <br>\r\n      <button (click)=\"auth.googleLogin()\" id=\"google\" class=\"btn-si btn-google\">Login With Google</button>\r\n     <!--  <button >Sign in with Google</button> -->\r\n      <br>\r\n      <br>\r\n      <br>\r\n      <p >Email</p>\r\n      <form #formData='ngForm' (ngSubmit)=\"onSubmit(formData)\">\r\n    \r\n    <!-- <input type=\"text\" name=\"\" placeholder=\"Enter Email\">\r\n    <p>Password</p>\r\n    <input type=\"password\" name=\"\" placeholder=\"••••••\"> -->\r\n    <input type=\"text\" style='font-style: italic;' placeholder=\"Email address..\" (ngModel)=\"email\" name=\"email\" class=\"txt\" required>\r\n      <input type=\"password\" style='font-style: italic;' placeholder=\"Password\" (ngModel)=\"password\" name=\"password\" class=\"txt\" required>\r\n\r\n    <input type=\"submit\" name=\"\" value=\"Sign In\">\r\n  </form>\r\n    <a  routerLink=\"/reset\" routerLinkActive=\"active\" class=\"alc\">Forget Password</a>\r\n    <br>\r\n    <br>\r\n    <a  fontUbuntu routerLink=\"/signup\" routerLinkActive=\"active\" class=\"alc\">No account? <strong>Create one here</strong></a>\r\n\r\n   \r\n   <!--  <a href='https://play.google.com/store/apps/details?id=com.ammostafa.stickykeep&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>\r\n      <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>\r\n\r\n    <div class =\"play\">Our app is now available on Google Play.</div> -->\r\n\r\n</div>\r\n</div>\r\n</ng-template>\r\n\r\n<ng-template #loading> Loading...</ng-template>\r\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/auth.service */ "./src/app/core/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

//import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

//import { moveIn } from '../router.animations';

//import { AngularFirestore } from 'angularfire2/firestore';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.auth.user) {
            this.router.navigate(['/members']);
        }
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        //  document.querySelector('body').classList.add('blue');
        //document.body.style.backgroundImage = "url(../../assets/post-it-note.jpg)";
        //  document.body.style.backgroundRepeat = "no-repeat";
        //   document.body.style.backgroundPosition = "center"; 
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        document.body.style.backgroundImage = "";
    };
    LoginComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        if (formData.valid) {
            console.log(formData.value);
            this.auth.emailLogin(formData.value.email, formData.value.password).then(function (success) {
                console.log(success);
                _this.router.navigate(['/members']);
            }).catch(function (err) {
                console.log("hi eror:" + err);
                _this.error = err;
                alert(_this.error);
            });
        }
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")],
        }),
        __metadata("design:paramtypes", [_core_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/main/main.component.css":
/*!*****************************************!*\
  !*** ./src/app/main/main.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/main/main.component.html":
/*!******************************************!*\
  !*** ./src/app/main/main.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<app-car-item></app-car-item>\r\n\r\n"

/***/ }),

/***/ "./src/app/main/main.component.ts":
/*!****************************************!*\
  !*** ./src/app/main/main.component.ts ***!
  \****************************************/
/*! exports provided: MainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainComponent", function() { return MainComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MainComponent = /** @class */ (function () {
    function MainComponent() {
    }
    MainComponent.prototype.ngOnInit = function () {
    };
    MainComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-main',
            template: __webpack_require__(/*! ./main.component.html */ "./src/app/main/main.component.html"),
            styles: [__webpack_require__(/*! ./main.component.css */ "./src/app/main/main.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], MainComponent);
    return MainComponent;
}());



/***/ }),

/***/ "./src/app/members/members.component.css":
/*!***********************************************!*\
  !*** ./src/app/members/members.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/members/members.component.html":
/*!************************************************!*\
  !*** ./src/app/members/members.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<!-- <div *ngIf=\"auth.user | async as user\">\r\n    hi {{user.email}}\r\n    user id is  {{user.uid}}\r\n</div> -->\r\n<!-- <button (click)=\"auth.signOut()\" class=\"logoutButton\">Logout</button> -->\r\n<upload-form></upload-form>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/members/members.component.ts":
/*!**********************************************!*\
  !*** ./src/app/members/members.component.ts ***!
  \**********************************************/
/*! exports provided: MembersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MembersComponent", function() { return MembersComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { PagerService } from '../_services/index'
var MembersComponent = /** @class */ (function () {
    function MembersComponent(dataService) {
        this.dataService = dataService;
    }
    MembersComponent.prototype.ngOnInit = function () {
        // this.getCars();
        // var s = this.auth.authState.displayName;
        // console.log("curent user is "+s);
        // get dummy data
        /*  this.http.get('https://jsonplaceholder.typicode.com/posts')
              .map((response: Response) => response.json())
              .subscribe(data => {
                  // set items to json response
                  this.allItems = data;
    
                  // initialize to page 1
                  this.setPage(1);
              }); */
    };
    MembersComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-members',
            template: __webpack_require__(/*! ./members.component.html */ "./src/app/members/members.component.html"),
            styles: [__webpack_require__(/*! ./members.component.css */ "./src/app/members/members.component.css")],
            providers: [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]]
        }),
        __metadata("design:paramtypes", [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]])
    ], MembersComponent);
    return MembersComponent;
}());



/***/ }),

/***/ "./src/app/photo-swipe/photo-swipe.component.css":
/*!*******************************************************!*\
  !*** ./src/app/photo-swipe/photo-swipe.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/photo-swipe/photo-swipe.component.html":
/*!********************************************************!*\
  !*** ./src/app/photo-swipe/photo-swipe.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Root element of PhotoSwipe. Must have class pswp. -->\r\n<div class=\"pswp\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" #photoSwipe>\r\n\r\n    <!-- Background of PhotoSwipe. \r\n                It's a separate element as animating opacity is faster than rgba(). -->\r\n    <div class=\"pswp__bg\"></div>\r\n\r\n    <!-- Slides wrapper with overflow:hidden. -->\r\n    <div class=\"pswp__scroll-wrap\">\r\n\r\n        <!-- Container that holds slides. \r\n                PhotoSwipe keeps only 3 of them in the DOM to save memory.\r\n                Don't modify these 3 pswp__item elements, data is added later on. -->\r\n        <div class=\"pswp__container\">\r\n            <div class=\"pswp__item\"></div>\r\n            <div class=\"pswp__item\"></div>\r\n            <div class=\"pswp__item\"></div>\r\n        </div>\r\n\r\n        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->\r\n        <div class=\"pswp__ui pswp__ui--hidden\">\r\n\r\n            <div class=\"pswp__top-bar\">\r\n\r\n                <!--  Controls are self-explanatory. Order can be changed. -->\r\n\r\n                <div class=\"pswp__counter\"></div>\r\n\r\n                <button class=\"pswp__button pswp__button--close\" title=\"Close (Esc)\"></button>\r\n                <button class=\"pswp__button pswp__button--share\" title=\"Share\"></button>\r\n                <button class=\"pswp__button pswp__button--fs\" title=\"Toggle fullscreen\"></button>\r\n                <button class=\"pswp__button pswp__button--zoom\" title=\"Zoom in/out\"></button>\r\n\r\n                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->\r\n                <!-- element will get class pswp__preloader--active when preloader is running -->\r\n                <div class=\"pswp__preloader\">\r\n                    <div class=\"pswp__preloader__icn\">\r\n                        <div class=\"pswp__preloader__cut\">\r\n                            <div class=\"pswp__preloader__donut\"></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"pswp__share-modal pswp__share-modal--hidden pswp__single-tap\">\r\n                <div class=\"pswp__share-tooltip\"></div>\r\n            </div>\r\n\r\n            <button class=\"pswp__button pswp__button--arrow--left\" title=\"Previous (arrow left)\"></button>\r\n            <button class=\"pswp__button pswp__button--arrow--right\" title=\"Next (arrow right)\"></button>\r\n\r\n            <div class=\"pswp__caption\">\r\n                <div class=\"pswp__caption__center\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/photo-swipe/photo-swipe.component.ts":
/*!******************************************************!*\
  !*** ./src/app/photo-swipe/photo-swipe.component.ts ***!
  \******************************************************/
/*! exports provided: PhotoSwipeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PhotoSwipeComponent", function() { return PhotoSwipeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var photoswipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! photoswipe */ "./node_modules/photoswipe/dist/photoswipe.js");
/* harmony import */ var photoswipe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(photoswipe__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var photoswipe_dist_photoswipe_ui_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! photoswipe/dist/photoswipe-ui-default */ "./node_modules/photoswipe/dist/photoswipe-ui-default.js");
/* harmony import */ var photoswipe_dist_photoswipe_ui_default__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(photoswipe_dist_photoswipe_ui_default__WEBPACK_IMPORTED_MODULE_2__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// Import PhotoSwipe
//mport PhotoSwipe           from 'photoswipe';
//import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';


var PhotoSwipeComponent = /** @class */ (function () {
    // ========================================================================
    function PhotoSwipeComponent() {
        this.images = [];
    }
    // ========================================================================
    PhotoSwipeComponent.prototype.openGallery = function (images, index) {
        // Build gallery images array
        images = images || this.images;
        // define options (if needed)
        var options = {
            // optionName: 'option value'
            // for example:
            index: index || 0 // start at first slide
        };
        // Initializes and opens PhotoSwipe
        var gallery = new photoswipe__WEBPACK_IMPORTED_MODULE_1__(this.photoSwipe.nativeElement, photoswipe_dist_photoswipe_ui_default__WEBPACK_IMPORTED_MODULE_2__, images, options);
        gallery.init();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('photoSwipe'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], PhotoSwipeComponent.prototype, "photoSwipe", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], PhotoSwipeComponent.prototype, "images", void 0);
    PhotoSwipeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-photo-swipe',
            template: __webpack_require__(/*! ./photo-swipe.component.html */ "./src/app/photo-swipe/photo-swipe.component.html"),
            styles: [__webpack_require__(/*! ./photo-swipe.component.css */ "./src/app/photo-swipe/photo-swipe.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PhotoSwipeComponent);
    return PhotoSwipeComponent;
}());



/***/ }),

/***/ "./src/app/reset-password/reset-password.component.css":
/*!*************************************************************!*\
  !*** ./src/app/reset-password/reset-password.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h2  {\r\n    display:inline;\r\n    }\r\n\r\n  /*  .resetBox{\r\n\r\n    top: 15%;\r\n    left: 3%;\r\n    position: absolute;\r\n\r\n   /*  position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0px;\r\n    margin: auto; */\r\n\r\n  /*   margin-top: 120px;\r\n        margin-left: 50px; \r\n    } */\r\n\r\n  input[type=\"submit\"]\r\n{\r\n\tborder: none;\r\n\toutline: none;\r\n\theight: 2em;\r\n\tcolor: rgb(51, 44, 148);\r\n\tfont-size: 16px;\r\n\tbackground: #ff267e;\r\n\tcursor: pointer;\r\n\tborder-radius: 10px;\r\n}\r\n\r\n  input[type=\"submit\"]:hover\r\n{\r\n\tbackground: #e0e414;\r\n\tcolor: #59685f;\r\n}\r\n\r\n  input[type=\"text\"]\r\n\r\n{\r\n\tborder: none;\r\n\tborder-bottom: 1px solid rgb(14, 179, 64);\r\n\tbackground: transparent;\r\n\toutline: none;\r\n\theight: 40px;\r\n\tcolor: rgb(1, 20, 1);\r\n    font-size: 16px;\r\n    width : 300px;\r\n}\r\n\r\n  input[type=\"text\"]:hover\r\n\r\n{\r\n\tborder-bottom: 1px solid #df10cd;\r\n\t/*color: #262626;*/\r\n}\r\n\r\n  ::-webkit-input-placeholder\r\n{\r\n\tcolor: rgba(26, 2, 2, 0.5);\r\n}\r\n\r\n  :-ms-input-placeholder\r\n{\r\n\tcolor: rgba(26, 2, 2, 0.5);\r\n}\r\n\r\n  ::-ms-input-placeholder\r\n{\r\n\tcolor: rgba(26, 2, 2, 0.5);\r\n}\r\n\r\n  ::placeholder\r\n{\r\n\tcolor: rgba(26, 2, 2, 0.5);\r\n}"

/***/ }),

/***/ "./src/app/reset-password/reset-password.component.html":
/*!**************************************************************!*\
  !*** ./src/app/reset-password/reset-password.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n <a routerLink=\"/login\" id=\"goback\">Go back</a>\r\n\r\n <h1>Reset your password now</h1>\r\n\r\n<div class=\"resetBox\">\r\n      <form #formData='ngForm' (ngSubmit)=\"onSubmit(formData)\">\r\n        \r\n    <!-- <input type=\"text\" name=\"\" placeholder=\"Enter Email\">\r\n    <p>Password</p>\r\n    <input type=\"password\" name=\"\" placeholder=\"••••••\"> -->\r\n       <input type=\"text\" placeholder=\"Email address..\"  name=\"email\" (ngModel)=\"email\" class=\"txt\" required>\r\n     \r\n<br>\r\n<br>\r\n    <input type=\"submit\" name=\"\" value=\"Reset Password\">\r\n  </form>\r\n\r\n</div>"

/***/ }),

/***/ "./src/app/reset-password/reset-password.component.ts":
/*!************************************************************!*\
  !*** ./src/app/reset-password/reset-password.component.ts ***!
  \************************************************************/
/*! exports provided: ResetPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordComponent", function() { return ResetPasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/auth.service */ "./src/app/core/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
    };
    ResetPasswordComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        if (formData.valid) {
            console.log(formData.value);
            this.auth.resetPassword(formData.value.email).then(function (success) {
                console.log(success);
                alert("Reset Email has been send to your email kindly check your inbox");
                _this.router.navigate(['/login']);
            }).catch(function (err) {
                console.log("hi eror:" + err);
                _this.error = err;
                alert(_this.error);
            });
        }
    };
    ResetPasswordComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reset-password',
            template: __webpack_require__(/*! ./reset-password.component.html */ "./src/app/reset-password/reset-password.component.html"),
            styles: [__webpack_require__(/*! ./reset-password.component.css */ "./src/app/reset-password/reset-password.component.css")]
        }),
        __metadata("design:paramtypes", [_core_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());



/***/ }),

/***/ "./src/app/signup/signup.component.css":
/*!*********************************************!*\
  !*** ./src/app/signup/signup.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h2  {\r\n    display:inline;\r\n    }\r\n\r\n  /*  .resetBox{\r\n\r\n    top: 15%;\r\n    left: 3%;\r\n    position: absolute;\r\n\r\n   /*  position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0px;\r\n    margin: auto; */\r\n\r\n  /*   margin-top: 120px;\r\n        margin-left: 50px; \r\n    } */\r\n\r\n  button[type=\"submit\"]\r\n{\r\n\tborder: none;\r\n\toutline: none;\r\n\theight: 2em;\r\n\tcolor: rgb(51, 44, 148);\r\n\tfont-size: 16px;\r\n\tbackground: #ff267e;\r\n\tcursor: pointer;\r\n\tborder-radius: 10px;\r\n}\r\n\r\n  input[type=\"submit\"]:hover\r\n{\r\n\tbackground: #e0e414;\r\n\tcolor: #59685f;\r\n}\r\n\r\n  input[type=\"text\"],\r\n input[type=\"password\"]\r\n\r\n{\r\n\tborder: none;\r\n\tborder-bottom: 1px solid rgb(14, 179, 64);\r\n\tbackground: transparent;\r\n\toutline: none;\r\n\theight: 40px;\r\n\tcolor: rgb(1, 20, 1);\r\n    font-size: 16px;\r\n    width : 300px;\r\n}\r\n\r\n  input[type=\"text\"]:hover,\r\n input[type=\"password\"]:hover\r\n\r\n{\r\n\tborder-bottom: 1px solid #111100;\r\n\t\r\n}\r\n\r\n  ::-webkit-input-placeholder\r\n{\r\n\tcolor: rgba(14, 0, 0, 0.5);\r\n}\r\n\r\n  :-ms-input-placeholder\r\n{\r\n\tcolor: rgba(14, 0, 0, 0.5);\r\n}\r\n\r\n  ::-ms-input-placeholder\r\n{\r\n\tcolor: rgba(14, 0, 0, 0.5);\r\n}\r\n\r\n  ::placeholder\r\n{\r\n\tcolor: rgba(14, 0, 0, 0.5);\r\n}"

/***/ }),

/***/ "./src/app/signup/signup.component.html":
/*!**********************************************!*\
  !*** ./src/app/signup/signup.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form-container\">\r\n  <a routerLink=\"/login\" id=\"goback\">Go back</a>\r\n\r\n  <h1>Join now</h1>\r\n\r\n  <span class=\"error\" *ngIf=\"error\" >{{ error }}</span>\r\n    \r\n  <form #signupForm=\"ngForm\" (ngSubmit)=\"onSubmit(signupForm)\">\r\n\r\n    <input type=\"text\" name=\"email\" class=\"txt\" ngModel required>\r\n    <br>\r\n    <input type=\"password\"  name=\"password\" class=\"txt\" ngModel required>\r\n    <br>\r\n    <br>\r\n   \r\n\r\n    <button type=\"submit\" [disabled]=\"signupForm.invalid\" class=\"basic-btn\">Create my account</button>\r\n  </form>\r\n  \r\n\r\n <!--  <form #EditFrm=\"ngForm\" (ngSubmit)=\"EditCar(EditFrm)\" >\r\n      {{EditFrm.valid}}\r\n      <div>\r\n          <label class=\"label label-primary\" for=\"\" translate>\r\n            Manufacturer:\r\n          </label>\r\n\r\n          <select class=\"form-control input-sm\"   name=\"carManufacturer\" ngModel required>\r\n              <option>NISSAN</option>\r\n              <option>TOYOTA</option>\r\n               \r\n            </select>\r\n        </div>\r\n      <button type=\"submit\"   [disabled]='EditFrm.invalid'>submit</button>\r\n    </form> -->\r\n</div>"

/***/ }),

/***/ "./src/app/signup/signup.component.ts":
/*!********************************************!*\
  !*** ./src/app/signup/signup.component.ts ***!
  \********************************************/
/*! exports provided: SignupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupComponent", function() { return SignupComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/auth.service */ "./src/app/core/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SignupComponent = /** @class */ (function () {
    function SignupComponent(auth, router) {
        this.auth = auth;
        this.router = router;
        this.i = 0;
    }
    SignupComponent.prototype.ngOnInit = function () {
    };
    /*   EditCar(editForm){
        console.log(editForm.value.carManufacturer)
        this.i++;
      }
     */
    SignupComponent.prototype.onSubmit = function (signupForm) {
        var _this = this;
        if (signupForm.valid) {
            var email = signupForm.value.email;
            console.log("sign in form data" + email);
            this.auth.emailSignUp(signupForm.value.email, signupForm.value.password).then(function (success) {
                console.log(success);
                // this.router.navigate(['/login'])
            }).then(function () {
                _this.auth.emailLogin(signupForm.value.email, signupForm.value.password);
            }).then(function () {
                // console.log(success);
                _this.router.navigate(['/members']);
            }).
                catch(function (err) {
                alert(err);
                _this.error = err;
            });
        }
    };
    SignupComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-signup',
            template: __webpack_require__(/*! ./signup.component.html */ "./src/app/signup/signup.component.html"),
            styles: [__webpack_require__(/*! ./signup.component.css */ "./src/app/signup/signup.component.css")]
        }),
        __metadata("design:paramtypes", [_core_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], SignupComponent);
    return SignupComponent;
}());



/***/ }),

/***/ "./src/app/upload-form/upload-form.component.css":
/*!*******************************************************!*\
  !*** ./src/app/upload-form/upload-form.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a:hover{\r\n\t \r\n\tfont-style: italic;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n}\r\n\r\na{\r\n\tcolor:white;\r\n\t\r\n}\r\n\r\n.toggleLang{\r\n    text-align: right;\r\n    direction: rtl;\r\n}\r\n\r\n.Logout{\r\n  \r\n            float: right;\r\n             \r\n                text-align: left;\r\n               /*  font-weight: bold; */\r\n                color: rgba(184, 207, 228, 0.877);\r\n                font-family:ubuntu;\r\n                font-size: medium;\r\n                margin-bottom: .5em;\r\n                margin-top: .5em;\r\n                /* font-family:Tahoma; */\r\n            }\r\n\r\n.lang{\r\n                /* float: right;\r\n                text-align: left;\r\n               \r\n                font-size: medium;\r\n                 font-weight: bold; \r\n                \r\n                font-family:ubuntu; */\r\n\r\n                float: right;\r\n                text-align: right;\r\n                font-weight: bold;\r\n                color: rgba(78, 10, 10, 0.699);\r\n                font-family:ubuntu;\r\n                font-size: medium;\r\n                margin-bottom: .5em;\r\n                margin-top: .5em;\r\n                \r\n                /* float : left ; */\r\n            }\r\n\r\n/*  .about{\r\n        float: left;\r\n        text-align: left;\r\n        font-weight: bold;\r\n        color: white;\r\n        font-family:Tahoma;\r\n  } */\r\n\r\n.logo{\r\n    vertical-align: bottom;\r\n    margin-bottom: .0em;\r\n    margin-top: 1em;\r\n   /*  margin-bottom:-20px ; */\r\n}\r\n\r\n.tab{\r\n    background-color: rgb(3, 17, 31);\r\n    overflow: auto;\r\n    align-items : center;\r\n    \r\n   \r\n  border: none;\r\n        \r\n  }\r\n\r\n.numOfImage{\r\n     float: right; \r\n}\r\n\r\n.numOfImageArab{\r\n    float: left; \r\n    padding-left: 10px;\r\n}\r\n\r\n#myProgress {\r\n    width:100%;\r\n    background-color: rgb(197, 30, 30);\r\n    position: fixed;\r\n    top: 0;\r\n    left:0;\r\n    height: 20px;\r\n    text-align: center;\r\n\r\n    display:  block;\r\n  }\r\n\r\n#myBar {\r\n    width: 1%;\r\n    left:0;\r\n    height: 20px;\r\n    background-color: green;\r\n    position: fixed;\r\n    top: 0;\r\n  }\r\n\r\n/* progrsss bar  */\r\n\r\nselect {\r\n   /*  max-width: 25%; */\r\n}\r\n\r\n/* .col-container2 {\r\n    display: table; /* Make the container element behave like a table  \r\n    width: 100%; /* Set full-width to expand the whole page  \r\n}\r\n\r\n.col2 {\r\n    display: table-cell; /* Make elements inside the container behave like table cells  \r\n} */\r\n\r\n.col-container {\r\n    display: table;\r\n    width: 100%;\r\n    padding :5px;\r\n    padding-right: 18px;\r\n    border: 1px  outset rgba(39, 25, 122, 0.877);\r\n    border-style:    dashed    ;\r\n}\r\n\r\n.col {\r\n    display: table-cell;\r\n    padding: 16px;\r\n}\r\n\r\n.box{\r\n   \r\n  /*  border: 1px solid rgba(184, 207, 228, 0.877); */\r\n    width: 50%;\r\n    height: 100%;\r\n     \r\n}\r\n\r\n.descrip{\r\n    margin-bottom: 3px;\r\n    align-content: bottom;\r\n}\r\n\r\n.box .droplet {\r\n   /*  display: inline-block; */\r\n    z-index: 2;\r\n    position: relative;\r\n    border-radius: 2px;\r\n    width: 100%;\r\n     height: auto;\r\n\r\n\r\n   /*  background-color: rgb(211, 200, 200); */\r\n     \r\n   /*  min-height: 300px; */\r\n    /* background-color: rgba(184, 207, 228, 0.288); */\r\n    background: linear-gradient(to bottom, #ededed2a 0%, #dededea8 100%);\r\n  /*  background: red; */\r\n    margin-top: -5px;\r\n    padding-top: 5px;\r\n    transition: box-shadow 0.35s;\r\n    margin: auto;    \r\n    \r\n}\r\n\r\n.test{\r\n    background-color: blue;\r\n}\r\n\r\n.box .toolbar {\r\n    /* width: 50%; */\r\n   /*  direction: rtl; */\r\n    \r\n    text-align: right;\r\n    align-content: center;\r\n    margin-top: 5px;\r\n    overflow: hidden;\r\n    position: relative;\r\n    z-index: 3;\r\n    height: 25px;\r\n    border-radius: 3px;\r\n    box-shadow: 0 0 10px rgba(0, 0, 0, .25);\r\n    /* background: linear-gradient(to bottom, #ce9999 0%, #a13f3f 100%); */\r\n    background: linear-gradient(to bottom, #ededed 0%, #dedede 100%);\r\n}\r\n\r\n.box .toolbar input {\r\n    margin-left: 40%;\r\n   \r\n      display: inline-block;\r\n    background-color: transparent;\r\n    float: left;\r\n    overflow: hidden;\r\n    width: 100px;\r\n    height: 100%;\r\n    border: 0;\r\n    cursor: pointer;\r\n    border-right: 1px solid rgba(0, 0, 0, .1);\r\n    color: rgba(0, 0, 0, .75);\r\n    transition: all 0.25s;\r\n}\r\n\r\n.clickOrDrag{\r\n     padding: 1px;\r\n     text-align: center; \r\n }\r\n\r\n.draghere{\r\n    /* top:30%; left:30%; \r\n    position: absolute; */\r\n    font-family:Ubuntu; \r\n    font-weight: bold; \r\n    font-size:  medium;\r\n    \r\n     color:rgba(0, 0, 0, 0.562)   ;\r\n    min-height: 135px;\r\n    height: auto;\r\n   /*  color: rgba(0, 0, 0, 0.281); */\r\n    /* color: rgb(149, 189, 226); */\r\n   \r\n    \r\n\r\n}\r\n\r\n.titles{\r\n    color: black;\r\n    /* font-size: large;*/\r\n    font-weight: bold; \r\n    font-family:Ubuntu; \r\n}\r\n\r\n.labels{\r\n          color:  black;\r\n          \r\n    }\r\n\r\n.carsObjects\r\n  { \r\n    overflow-x:hidden;\r\n    white-space:nowrap; \r\n\r\n    width: 100%;\r\n  }\r\n\r\n.memberLi{\r\n\r\n\r\n\r\n}\r\n\r\nli\r\n{ \r\n    /* display: inline-block; */\r\n}\r\n\r\n.droplet ul.files li div.delete {\r\n    background-color: rgba(139, 128, 231, 0.856);\r\n    width: 50px;\r\n    height: 50px;\r\n    font-family: Lato, Arial, Tahoma, Helvetica, sans-serif;\r\n    color: white;\r\n    font-size: 25px;\r\n    text-shadow: 1px 1px 0 rgba(0, 0, 0, .25);\r\n    text-align: center;\r\n    cursor: pointer;\r\n    line-height: 50px;\r\n    position: absolute;\r\n    border-radius: 50%;\r\n    z-index: 101;\r\n    top: 25px;\r\n    left: 25px;\r\n    opacity: 0;\r\n    transition: all .30s;\r\n    -webkit-transform: scale(0.5);\r\n            transform: scale(0.5);\r\n  \r\n}\r\n\r\n.droplet ul.files li:hover div.delete {\r\n    opacity: 1;\r\n    -webkit-transform: scale(1);\r\n            transform: scale(1);\r\n}\r\n\r\n.droplet ul.files li div.delete:hover {\r\n    background-color: rgba(0, 0, 0, .45);\r\n}\r\n\r\n.droplet ul.files {\r\n   /*  height: 100%; */\r\n   /*  width: 100%; */\r\n    display: inline-block;\r\n    overflow-y: auto;\r\n    padding: 5px;\r\n    list-style-type: none;\r\n    transition: all .5s;\r\n    height: 100%;\r\n    text-align: left;\r\n}\r\n\r\nul{\r\n    display: inline-block;\r\n}\r\n\r\n.droplet ul.files li div.size {\r\n    background-color: rgba(255, 255, 255, .5);\r\n    position: absolute;\r\n    bottom: 5px;\r\n    right: 5px;\r\n    pointer-events: none;\r\n    font-size: 9px;\r\n    font-family: Lato, Arial, Tahoma, Helvetica, sans-serif;\r\n    padding: 1px 4px;\r\n}\r\n\r\n.droplet ul.files li {\r\n    width: 100px;\r\n    height: 100px;\r\n    padding: 1px;\r\n    float: left;\r\n    position: relative;\r\n    margin: 5px;\r\n}\r\n\r\n.droplet ul.files li img {\r\n    max-width: 96px;\r\n    background-size: cover;\r\n    background-repeat: no-repeat;\r\n    height: 96px;\r\n    width: 96px;\r\n    background-color: red;\r\n    box-shadow: 0 0 10px rgba(0, 0, 0, .25);\r\n    border: 1px solid white;\r\n    display: block;\r\n}\r\n\r\n/* .colourful {\r\n    background:\r\n        -webkit-linear-gradient(45deg, hsla(332, 18%, 55%, 1) 0%, hsla(332, 18%, 55%, 0) 70%),\r\n        -webkit-linear-gradient(315deg, hsla(290, 22%, 50%, 1) 10%, hsla(290, 22%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(225deg, hsla(342, 27%, 50%, 1) 10%, hsla(342, 27%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(135deg, hsla(169, 0%, 100%, 1) 100%, hsla(169, 0%, 100%, 0) 70%);\r\n    background:\r\n        linear-gradient(45deg, hsla(332, 18%, 55%, 1) 0%, hsla(332, 18%, 55%, 0) 70%),\r\n        linear-gradient(135deg, hsla(290, 22%, 50%, 1) 10%, hsla(290, 22%, 50%, 0) 80%),\r\n        linear-gradient(225deg, hsla(342, 27%, 50%, 1) 10%, hsla(342, 27%, 50%, 0) 80%),\r\n        linear-gradient(315deg, hsla(169, 0%, 100%, 1) 100%, hsla(169, 0%, 100%, 0) 70%);\r\n} */\r\n\r\n.colourful {\r\n /*    background:\r\n        -webkit-linear-gradient(45deg, rgb(201, 204, 221) 0%, hsla(332, 18%, 55%, 0) 70%),\r\n        -webkit-linear-gradient(315deg, rgb(99, 103, 155) 10%, hsla(290, 22%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(225deg, rgb(135, 139, 172) 10%, hsla(342, 27%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(135deg, rgb(226, 226, 233) 100%, hsla(169, 0%, 100%, 0) 70%); */\r\n      /*   background:\r\n        -webkit-linear-gradient(45deg, rgb(84, 98, 155) 0%, hsla(332, 18%, 55%, 0) 70%),\r\n        -webkit-linear-gradient(315deg, rgb(151, 154, 184) 10%, hsla(290, 22%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(225deg, rgb(147, 149, 180) 10%, hsla(342, 27%, 50%, 0) 80%),\r\n        -webkit-linear-gradient(135deg, rgb(191, 191, 209) 100%, hsla(169, 0%, 100%, 0) 70%); */\r\n   /*  background:\r\n        linear-gradient(45deg, rgb(201, 204, 221) 0%, hsla(332, 18%, 55%, 0) 70%),\r\n        linear-gradient(135deg, rgb(99, 103, 155) 10%, hsla(290, 22%, 50%, 0) 80%),\r\n        linear-gradient(225deg, rgb(135, 139, 172) 10%, hsla(342, 27%, 50%, 0) 80%),\r\n        linear-gradient(315deg, rgb(226, 226, 233) 100%, hsla(169, 0%, 100%, 0) 70%); */\r\n}\r\n\r\n/*////////////////////////////////////////////////////////////////////////*/\r\n\r\n.num_of_img {\r\n    background-color: rgba(6, 17, 82, 0.781);\r\n    position: absolute;\r\n    /* bottom: 5px; */\r\n    /* right: 5px;  */\r\n    pointer-events: none;\r\n    font-size: 13px;\r\n    font-family: Lato, \"Times New Roman\", Tahoma, bold , Helvetica, sans-serif;\r\n   /*  padding: 1px 4px; */\r\n\r\n    /* top: 100px; */\r\n    color:white;\r\n    left: 140px; \r\n    font-weight: bold;\r\n    \r\n}\r\n\r\n.rightOfBox{\r\n    float: left;\r\n   /*  text-align: left; */\r\n    font-weight: bold;\r\n    color: black;\r\n    font-family:Ubuntu;\r\n     \r\n}\r\n\r\n.container2 {\r\n    position: relative;\r\n    text-align: left;\r\n    color: solid rgba(58, 33, 134, 0.514);\r\n    margin-left: 0%;\r\n    padding-left: 0%;\r\n    \r\n   /* height: 200px;*/\r\n   /*  float: left; */\r\n\r\n}\r\n\r\n.SearchBox {\r\n    background-color: rgba(211, 211, 211, 0.185); \r\n    /* background-color: rgba(211, 211, 211, 0.404);  */\r\n    /* width: 200px; */\r\n   /*  border: 1px solid rgba(83, 50, 145, 0.575); */\r\n    padding: 10px;\r\n    margin: 1px;\r\n}\r\n\r\n.contactBox {\r\n    background-color: #2A6496;\r\n\r\n    width: 10em; \r\n    border: 1px solid #2A6496;\r\n    padding: 10px;\r\n    margin: 1px;\r\n    text-align: center;\r\n    color: white;\r\n    /* float: right;  */\r\n}\r\n\r\n.searchh2{\r\n    \r\n    font-weight: bold;\r\n   /*  align :center; */\r\n}\r\n\r\n/* .containerPrice{\r\n    color: #2A6496;\r\n    float: right; \r\n    font-weight: bold;\r\n   \r\n}\r\n\r\n.containerKilo{\r\n    color: rgb(67, 152, 226);\r\n    float: right; \r\n    font-weight: bold;\r\n     \r\n}\r\n\r\n.containerYear{\r\n    color: black;\r\n    float: right; \r\n    font-weight: bold;\r\n   \r\n} */\r\n\r\n.verticalLine {\r\n   /*  border-left: 3px solid rgba(58, 33, 134, 0.514); */\r\n    border-left: 3px solid #2A6496;\r\n    height: 180px;\r\n    float: left;\r\n    padding-right: 10px;\r\n}\r\n\r\n.containerTitle\r\n{\r\n     \r\n    /* float: left; */\r\n    text-align: left;\r\n    font-size: large;\r\n    font-weight: bold;\r\n    font-family:Tahoma;\r\n   /*  padding-bottom: center; */\r\n}\r\n\r\n.priceAtitle{\r\n    /*  padding: 20px;  */\r\n}\r\n\r\nul \r\n{\r\n    line-height:100%;  \r\n    padding-left: 3%;\r\n  \r\n   \r\n}\r\n\r\n#PreviousAd{\r\n    padding: 0;\r\n    list-style-type: none;\r\n}\r\n\r\nhr {\r\n    /* border: 0; */\r\n    clear:both;\r\n    display:block;\r\n    /*  width: 96%;  */              \r\n    /* background-color:black; */\r\n    height: 4px;\r\n  }\r\n\r\n/* img {\r\n    display: block;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n   \r\n} */\r\n\r\n.container-fluid {\r\n    margin-left: 1%;\r\n    margin-right: 2%;\r\n}\r\n\r\n.PlaceAd{\r\n  \r\nfloat: right;\r\n \r\n    text-align: left;\r\n    font-weight: bold;\r\n    color: rgba(184, 207, 228, 0.877);\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n    /* font-family:Tahoma; */\r\n}\r\n\r\n.login{\r\n  \r\n    float: left;\r\n    text-align: left;\r\n    font-weight: bold;\r\n    color: rgba(184, 207, 228, 0.877);\r\n    font-family:Tahoma;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n    }\r\n\r\n/* .lang{\r\n    float: right;\r\n    text-align: left;\r\n    font-weight: bold;\r\n    color: white;\r\n    font-family:Tahoma;\r\n    /* float : left ; */\r\n\r\n/*} */\r\n\r\n.about{\r\n    float: left;\r\n    text-align: left;\r\n     font-size: medium;\r\n    color: white;\r\n    font-family:ubuntu;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n}\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/upload-form/upload-form.component.html":
/*!********************************************************!*\
  !*** ./src/app/upload-form/upload-form.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"tab\">\r\n  <div class=\"col-md-2\"> </div>\r\n  <div class=\"col-md-8\">\r\n\r\n    <br>\r\n    <div class='about' (click)= \"router.navigate(['/main'])\">  <a style=\"color:white;\">Home</a></div>\r\n    <div class='about' (click)= \"router.navigate(['/about'])\"> &nbsp;&nbsp; <a style=\"color:white;\">About</a> </div>\r\n    <div class='about' (click)= \"router.navigate(['/contact'])\"> &nbsp;&nbsp; <a style=\"color:white;\">Contact</a> </div>\r\n    <div class='Logout' (click)=\"auth.signOut()\"> &nbsp;&nbsp; <a style=\"color: rgba(184, 207, 228, 0.877);\">Logout</a></div>\r\n\r\n    <!-- <div class=\"PlaceAd \" (click)=\"placeYourAd()\">Place Your Ad</div> -->\r\n   <!--  <div class='lang'> <a style=\"color:white;\">العربية</a> &nbsp;&nbsp;</div>\r\n    <br>\r\n    <br>\r\n  </div>\r\n</div> -->\r\n\r\n<div class='row' >\r\n  <div class=\"col-md-1\"></div>\r\n  <div class=\"col-md-6\">\r\n          \r\n          <h1 class='logo' align='right' style='display: inline;  \r\n         font-family:ubuntu; font-weight: bold ' translate>MembersTitle</h1>\r\n         </div>\r\n         <div class=\"col-md-2\"></div>\r\n<div class=\"col-md-3 \">\r\n    <h2 class='logo' style='display: inline;   text-decoration: underline; \r\n    font-family:Shrikhand, cursive; color:gray;'>ZEZENIA.ae#</h2>  <!-- zezenia -->\r\n<img  class='logo'  style='width:80px;height:25px;    vertical-align: bottom;   ' src=\"assets/logo.png\">\r\n</div>\r\n\r\n\r\n\r\n\r\n</div>\r\n<div class=\"tab\">\r\n  <div class=\"col-md-2\"> </div>\r\n  <div class=\"col-md-8\">\r\n\r\n       \r\n      <div class='about' (click)= \"router.navigate(['/main'])\"> <a style=\"color:white;\"><i class=\"fa fa-home\" style=\"font-size:normal;color:greenyellow\"></i>&nbsp;<span translate>Home</span> &nbsp;|</a></div>\r\n      <div class='about' (click)= \"router.navigate(['/about'])\"> &nbsp; <a style=\"color:white;\"><span translate>About</span> &nbsp;|</a> </div>\r\n      <div class='about' (click)= \"router.navigate(['/contact'])\"> &nbsp; <a style=\"color:white;\" translate>Contact</a> </div>\r\n      <div class='Logout' (click)=\"auth.signOut()\">    <a style=\"color: rgba(184, 207, 228, 0.877);\" >  <span translate>Logout</span> <i class=\"fa fa-sign-out\" style=\"color:red;font-size:normal\"></i></a></div>\r\n      \r\n      \r\n      <div class='lang' > <a (click)=\"switchLanguage()\" style=\"color: white;\" translate=\"\">lang </a>&nbsp;&nbsp;</div>\r\n          \r\n  </div>\r\n  <div class=\"col-md-2\"> </div>\r\n</div>\r\n\r\n\r\n\r\n  <div class=\"container\" [class.toggleLang]=\"toggleLanguage\" >\r\n\r\n     <h4 class=\"titles\"><span translate>Hi</span> {{ userDisplayName }}!, {{userEmail}}</h4>\r\n    <form #frm=\"ngForm\" (ngSubmit)=\"addCar(frm)\" *ngIf=\"!toggleForm\">\r\n\r\n      <h3 class=\"titles\" translate> PlaceAdTitle </h3>\r\n\r\n\r\n      <!-- <button (click)=\"upload()\">Upload {{imagePreviews.length}} files</button> -->\r\n\r\n      <div *ngIf=\"uploadProgress\">\r\n          <div id=\"myProgress\">.\r\n            <div id=\"myBar\" [ngStyle]=\"{'width': uploadProgress+'%'}\"><span style='font-size: large;font-weight:900 ;color:white '> {{ uploadProgress }} %</span></div>\r\n          </div>\r\n         \r\n       \r\n        </div>\r\n\r\n \r\n \r\n<div class=\"col-container\">\r\n   \r\n  \r\n     \r\n      <!--  <div class='col-md-6'> -->\r\n<div class='box col'>\r\n      <div class=\"form-group row\">\r\n        \r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"city\" translate>\r\n             City\r\n          </label>\r\n\r\n          <select class=\"form-control input-sm\" name=\"carCity\" ngModel>\r\n              <option selected value >Abu Dhabi</option>\r\n              <option >Ajman</option>\r\n              <option>Alain</option>\r\n              <option>Dubai</option>\r\n              <option selected>Fujaira</option>\r\n              <option>Ras Alkhaima</option>\r\n              <option>Sharjah</option>\r\n              <option>Um Alqwain</option>\r\n              \r\n              \r\n            </select>\r\n        </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"\" translate>\r\n            Manufacturer\r\n          </label>\r\n\r\n         <!--  <select class=\"form-control input-sm\"   name=\"carManufacturer\" ngModel>\r\n              <option>NISSAN</option>\r\n              <option>TOYOTA</option>\r\n               \r\n            </select> -->\r\n\r\n            <select class=\"form-control input-sm\" name=\"carManufacturer\" (change)=\"onManufacturersChange($event.target.value)\"\r\n            ngModel>\r\n            <option selected value>unspecified</option>\r\n            <option *ngFor=\"let m of ManufacturersObject\">\r\n                {{m.manufacture_name}}\r\n            </option> \r\n           \r\n         </select> \r\n        </div>\r\n</div>   <!--  //form goup row close  -->\r\n\r\n<div class=\"form-group row\">\r\n        <div   class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"\" translate>\r\n            Model\r\n          </label>\r\n\r\n          <select class=\"form-control input-sm\" name=\"carModel\" ngModel>\r\n\r\n             \r\n            <option *ngFor=\"let model of ModelsObject\">\r\n                {{model.model_name}}\r\n            </option>\r\n\r\n        </select>\r\n        </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"\" translate>\r\n            Price\r\n          </label>\r\n\r\n          <input type=\"number\" class=\"form-control input-sm\" name=\"carPrice\" value=\"\" ngModel >\r\n        </div>\r\n\r\n        \r\n\r\n      </div>\r\n      <!-- form row -->\r\n     \r\n\r\n      <div class=\"form-group row\">\r\n\r\n          <div class=\"col-xs-6\">\r\n              <label class=\"label label-primary\" for=\"Year\" translate> \r\n                Year\r\n              </label>\r\n      \r\n              <select class=\"form-control input-sm\"   name=\"carYear\" ngModel>\r\n                  <option>2019</option>\r\n                  <option>2018</option>\r\n                  <option>2017</option>\r\n                  <option>2016</option>\r\n                  <option>2015</option>\r\n                  <option>2014</option>\r\n                  <option>2013</option>\r\n                  <option>2012</option>\r\n                  <option>2011</option>\r\n                  <option>2010</option>\r\n                  <option>2009</option>\r\n                  <option>2008</option>\r\n                  <option>2007</option>\r\n                  <option>2006</option>\r\n                  <option>2005</option>\r\n                  <option>2004</option>\r\n                  <option>2003</option>\r\n                  <option>2002</option>\r\n                  <option>2001</option>\r\n                  <option>2000</option>\r\n                   \r\n                  <!-- <option>&#8920; 2000</option> -->\r\n                </select>\r\n            </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"\" translate>\r\n            Kilometers\r\n          </label>\r\n\r\n          <input type=\"number\" class=\"form-control input-sm\" name=\"carKilometers\" value=\"\" ngModel >\r\n        </div>\r\n</div>\r\n<div class=\"form-group row\">\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"carSpecs\" translate>\r\n            Specs\r\n          </label>\r\n\r\n          <select class=\"form-control input-sm\"   name=\"carSpecs\" ngModel>\r\n              <option>GCC</option>\r\n              <option>AMERICAN</option>\r\n              <option>JAPANESE</option>\r\n              <option>EUROPE</option>\r\n              <option>OHTER</option>\r\n            </select>\r\n        </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n            <label class=\"label label-primary\" for=\"Cylinders\" translate>\r\n              Cylinder\r\n            </label>\r\n  \r\n            <select class=\"form-control input-sm\"   name=\"carCylinders\" ngModel>\r\n                <option>3</option>\r\n                <option>4</option>\r\n                <option>6</option>\r\n                <option>8</option>\r\n                <option>12</option>\r\n              </select>\r\n          </div>\r\n\r\n        \r\n\r\n      </div>\r\n      <!-- form row -->\r\n\r\n      <div class=\"form-group row\">\r\n        \r\n\r\n        <div class=\"col-xs-6\">\r\n            <label class=\"label label-primary\" for=\"carWarranty\" translate>\r\n              warranty\r\n            </label>\r\n  \r\n            <select class=\"form-control input-sm\"   name=\"carWarranty\" ngModel>\r\n                <option>YES</option>\r\n                <option>NO</option>\r\n                <option>DOESN'T APPLY</option>\r\n              </select>\r\n          </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"color\" translate>\r\n            Color\r\n          </label>\r\n\r\n          <select class=\"form-control input-sm\"  name=\"carColor\"  ngModel>\r\n               \r\n              <option>Silver</option>\r\n              <option>White</option>\r\n              <option>Brown</option>\r\n              <option> Black</option>\r\n              <option>Blue</option>\r\n              <option>Red</option>\r\n              <option>Gray</option>\r\n              <option>Green</option>\r\n              <option>Gold</option>\r\n              <option>Yellow</option>\r\n              <option>Other</option>\r\n               \r\n            </select>\r\n        </div>\r\n        </div>\r\n\r\n        <div class=\"form-group row\">\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"carTransmission\" translate>\r\n            Transmission\r\n          </label>\r\n                <select class=\"form-control input-sm\"   name=\"carTransmission\" ngModel>\r\n                <option>Automatic</option>\r\n                <option>Manual</option>\r\n                <option>Hybrid</option>\r\n                 \r\n              </select>\r\n          \r\n        </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n          <label class=\"label label-primary\" for=\"carPhone\" translate> \r\n            ContactNumber\r\n          </label>\r\n\r\n          <input type=\"text\" class=\"form-control input-sm\" name=\"carPhone\" placeholder=\"Enter Phone number\"  value=\"\" ngModel >\r\n        </div>\r\n\r\n      </div>\r\n      <!-- form row -->\r\n\r\n    \r\n\r\n    \r\n\r\n    </div>  <!--  form inputs closed  -->\r\n  \r\n    \r\n         \r\n        <div class=\"box col\">\r\n           <!--  <div class=\"form-group row\"> -->\r\n                <div class=\"form-group row\">\r\n                    <label class=\"label label-primary\" for=\"exampleFormControlTextarea1\" translate>DESCRIPTION</label>\r\n                    <textarea class=\"form-control input-sm\" name=\"carDESCRIPTION\" rows=\"5\" ngModel></textarea>\r\n                  </div>\r\n               <!--  </div> -->\r\n  \r\n               <div class=\"form-group row\">\r\n          <div class=\"label label-primary\" translate> UploadImage</div>\r\n          <div class=\"toolbar\">\r\n            <input #file type=\"file\" name='image' (change)=\"onImageChange($event)\" value=\"Add Files...\" accept=\"image/*\" multiple>\r\n            <!--  <button (click)=\"file.click()\">Upload file</button> -->\r\n  \r\n          </div>\r\n  \r\n  \r\n          <div class=\"droplet\" fileDrop (filesDropped)=\"handleDrop($event)\" (filesHovered)=\"dropzoneState($event)\" > <!-- [ngClass]=\"{'active': dropzoneActive}\" -->\r\n  \r\n            <!--  <i class=\"fa fa-cloud-upload fa-2x\"></i> -->\r\n            <div class=\"draghere text-muted\" (click)=\"file.click()\">\r\n              <div class='clickOrDrag'><span translate>Click</span> ... <br>Maximum 10 images </div>\r\n            <ul class=\"files\" (click)=\"$event.stopPropagation()\">\r\n  \r\n              <li *ngFor=\"let image of bigImagePreviews\">\r\n  \r\n                <a target=\"#\" [href]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n                  <img class=\"droplet-preview\" [src]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n                </a>\r\n  \r\n                <div class=\"delete\" (click)=\"removeImage(image.name);\">&times;</div>\r\n                <div class=\"size\">{{image.size / 1024 / 1024 | number}}MB</div>\r\n              </li>\r\n  \r\n            </ul>\r\n        \r\n         \r\n          \r\n            </div>\r\n          \r\n          </div>\r\n        </div>\r\n          \r\n        <div class=\"form-group row\">\r\n          <button type=\"submit\" name='button' class='btn btn-warning btn-sm' [disabled]='frm.invalid || imageNotReady'><span translate>{{goOrLoading}}</span> </button>\r\n          <span  [class.numOfImage]=\"!toggleLanguage\" [class.numOfImageArab]=\"toggleLanguage\">{{bigImagePreviews.length}}  <span translate>Images</span></span>\r\n        </div>\r\n         \r\n        </div><!-- box closed   [class.numOfImage]=\"!toggleLanguage\" -->\r\n       \r\n  </div>  \r\n</form>\r\n  \r\n\r\n\r\n\r\n <form #EditFrm=\"ngForm\" (ngSubmit)=\"EditCar(EditFrm)\" *ngIf=\"toggleForm\">\r\n <h3 class=\"titles\" translate> EditAdTitle </h3>\r\n\r\n\r\n <!-- <button (click)=\"upload()\">Upload {{imagePreviews.length}} files</button> -->\r\n\r\n <div *ngIf=\"uploadProgress\">\r\n    <div id=\"myProgress\">.\r\n      <div id=\"myBar\" [ngStyle]=\"{'width': uploadProgress+'%'}\"><span style='font-size: large;font-weight:900 ;color:white '> {{ uploadProgress }} %</span></div>\r\n    </div>\r\n   \r\n \r\n  </div>\r\n\r\n\r\n\r\n\r\n\r\n   \r\n <!--  <div class='col-md-6'> -->\r\n    <div class=\"col-container\">\r\n   \r\n  \r\n     \r\n        <!--  <div class='col-md-6'> -->\r\n  <div class='box col'>\r\n        <div class=\"form-group row\">\r\n          \r\n  \r\n          <div class=\"col-xs-6\">\r\n \r\n   \r\n\r\n    \r\n     <label class=\"label label-primary\" for=\"carcity\" translate>\r\n        City\r\n     </label>\r\n\r\n     <select class=\"form-control input-sm\" name=\"carcity\" value=\"\" [ngModel]=\"selectedCar.City\">\r\n         <option>Abu Dhabi</option>\r\n         <option>Ajman</option>\r\n         <option>Alain</option>\r\n         <option>Dubai</option>\r\n         <option>Fujaira</option>\r\n         <option>Ras Alkhaima</option>\r\n         <option>Sharjah</option>\r\n         <option>Um Alqwain</option>\r\n         \r\n         \r\n       </select>\r\n   </div>\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carmanufacturer\" translate>\r\n      Manufacturer\r\n     </label>\r\n\r\n     <select class=\"form-control input-sm\"   name=\"carmanufacturer\" (change)=\"onManufacturersChange($event.target.value)\"  [ngModel]=\"selectedCar.Manufacturer_name\">\r\n         \r\n          \r\n      \r\n\r\n       <option selected value>unspecified</option>\r\n       <option *ngFor=\"let m of ManufacturersObject\">\r\n           {{m.manufacture_name}}\r\n       </option> \r\n      \r\n    </select> \r\n   </div>\r\n  </div>\r\n\r\n  <div class=\"form-group row\">\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carmodel\" translate>\r\n       Model\r\n     </label>\r\n\r\n     <select class=\"form-control input-sm\"   name=\"carmodel\" [ngModel]=\"selectedCar.Model_name\">\r\n         \r\n             \r\n          <option *ngFor=\"let model of ModelsObject\">\r\n              {{model.model_name}}\r\n          </option>\r\n\r\n       \r\n          \r\n       </select>\r\n   </div>\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carprice\" translate>\r\n       Price\r\n     </label>\r\n\r\n     <input type=\"number\" class=\"form-control input-sm\" name=\"carprice\" value=\"\" [ngModel]=\"selectedCar.Price\">\r\n   </div>\r\n\r\n   \r\n\r\n </div>\r\n <!-- form row -->\r\n\r\n\r\n <div class=\"form-group row\">\r\n\r\n      <div class=\"col-xs-6\">\r\n         <label class=\"label label-primary\" for=\"caryear\" translate>\r\n           Year\r\n         </label>\r\n \r\n         <select class=\"form-control input-sm\"   name=\"caryear\" [ngModel]=\"selectedCar.Year\">\r\n          \r\n          <option>2019</option>\r\n          <option>2018</option>\r\n          <option>2017</option>\r\n          <option>2016</option>\r\n          <option>2015</option>\r\n          <option>2014</option>\r\n          <option>2013</option>\r\n          <option>2012</option>\r\n          <option>2011</option>\r\n          <option>2010</option>\r\n          <option>2009</option>\r\n          <option>2008</option>\r\n          <option>2007</option>\r\n          <option>2006</option>\r\n          <option>2005</option>\r\n          <option>2004</option>\r\n          <option>2003</option>\r\n          <option>2002</option>\r\n          <option>2001</option>\r\n          <option>2000</option>\r\n\r\n\r\n           </select>\r\n       </div>\r\n  \r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carkilometers\" translate>\r\n       Kilometers\r\n     </label>\r\n\r\n     <input type=\"number\" class=\"form-control input-sm\" name=\"carkilometers\" value=\"\"[ngModel]=\"selectedCar.Kilometers\">\r\n   </div>\r\n  </div>\r\n\r\n\r\n   <div class=\"form-group row\">\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"color\" translate>\r\n       Specs\r\n     </label>\r\n\r\n     <select class=\"form-control input-sm\"   name=\"carspecs\" [ngModel]=\"selectedCar.Specs\">\r\n         <option>GCC</option>\r\n         <option>AMERICAN</option>\r\n         <option>JAPANESE</option>\r\n         <option>EUROPE</option>\r\n         <option>OHTER</option>\r\n       </select>\r\n   </div>\r\n\r\n   <div class=\"col-xs-6\">\r\n       <label class=\"label label-primary\" for=\"carcylinders\" translate>\r\n          Cylinders\r\n       </label>\r\n\r\n       <select class=\"form-control input-sm\"   name=\"carcylinders\" [ngModel]=\"selectedCar.NoOfCylinders\">\r\n           <option>3</option>\r\n           <option>4</option>\r\n           <option>6</option>\r\n           <option>8</option>\r\n           <option>12</option>\r\n         </select>\r\n     </div>\r\n\r\n   \r\n\r\n </div>\r\n <!-- form row -->\r\n\r\n <div class=\"form-group row\">\r\n   \r\n\r\n   <div class=\"col-xs-6\">\r\n       <label class=\"label label-primary\" for=\"carwarranty\" translate>\r\n         Warranty\r\n       </label>\r\n\r\n       <select class=\"form-control input-sm\"   name=\"carwarranty\" [ngModel]=\"selectedCar.Warranty\">\r\n           <option>YES</option>\r\n           <option>NO</option>\r\n           <option>DOESN'T APPLY</option>\r\n         </select>\r\n     </div>\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carcolor\" translate>\r\n       Color\r\n     </label>\r\n\r\n     <select class=\"form-control input-sm\"  name=\"carcolor\" [ngModel]=\"selectedCar.Color\">\r\n      <option>Silver</option>\r\n      <option>White</option>\r\n      <option>Brown</option>\r\n      <option> Black</option>\r\n      <option>Blue</option>\r\n      <option>Red</option>\r\n      <option>Gray</option>\r\n      <option>Green</option>\r\n      <option>Gold</option>\r\n      <option>Yellow</option>\r\n      <option>Other</option>\r\n          \r\n       </select>\r\n   </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"form-group row\">\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"cartransmission\" translate>\r\n       Transmission\r\n     </label>\r\n           <select class=\"form-control input-sm\"    name=\"cartransmission\" [ngModel]=\"selectedCar.Transmission\">\r\n           <option>Automatic</option>\r\n           <option>Manual</option>\r\n           <option>Hybrid</option>\r\n            \r\n         </select>\r\n     \r\n   </div>\r\n\r\n   <div class=\"col-xs-6\">\r\n     <label class=\"label label-primary\" for=\"carphone\" translate>\r\n       ContactNumber\r\n     </label>\r\n\r\n     <input type=\"text\" class=\"form-control input-sm\" name=\"carphone\" placeholder=\"Enter Phone number\"  value=\"\" [ngModel]=\"selectedCar.ContactNumber\">\r\n   </div>\r\n\r\n </div>\r\n</div>\r\n <!-- form row -->\r\n\r\n\r\n <div class=\"box col\">\r\n      \r\n\r\n\r\n <div class=\"form-group row\">\r\n     <label class=\"label label-primary\" for=\"exampleFormControlTextarea1\"  translate>DESCRIPTION</label>\r\n     <textarea class=\"form-control input-sm\" name=\"cardescription\" rows=\"5\" [ngModel]=\"selectedCar.DESCRIPTION\">\r\n\r\n     </textarea>\r\n   </div>\r\n \r\n \r\n\r\n             <div class=\"form-group row\">\r\n        <div class=\"label label-primary\" translate> UploadImage</div>\r\n        <div class=\"toolbar\">\r\n          <input #file type=\"file\" name='edit_image' (change)=\"onImageChange($event)\" value=\"Add Files...\" accept=\"image/*\" multiple>\r\n          <!--  <button (click)=\"file.click()\">Upload file</button> -->\r\n\r\n        </div>\r\n\r\n\r\n        <div class=\"droplet\" fileDrop (filesDropped)=\"handleDrop($event)\" (filesHovered)=\"dropzoneState($event)\" > <!-- [ngClass]=\"{'active': dropzoneActive}\" -->\r\n\r\n          <!--  <i class=\"fa fa-cloud-upload fa-2x\"></i> -->\r\n          <div class=\"draghere text-muted\" (click)=\"file.click()\">\r\n             <div class='clickOrDrag'><span translate>Click</span> ... <br>Maximum 10 images </div>\r\n             <ul class=\"files\" (click)=\"$event.stopPropagation()\">\r\n\r\n                <li *ngFor=\"let image of selectedCar.Thums\">\r\n         \r\n                  <!-- <a target=\"#\" [href]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n                    <img class=\"droplet-preview\" [src]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n                  </a> -->\r\n                   \r\n                  <a target=\"#\" [href]=\"image\">\r\n                   <img class=\"droplet-preview\" [src]=\"image\">\r\n                 </a>\r\n         \r\n                  <div class=\"delete\" (click)=\"removeImageFromServer(image);\">&times;</div>\r\n                  <div class=\"size\">{{image.size / 1024 / 1024 | number}}MB</div>\r\n                </li>\r\n              </ul>   \r\n                <ul class=\"files\" (click)=\"$event.stopPropagation()\">\r\n\r\n            <li *ngFor=\"let image of bigImagePreviews\">\r\n\r\n              <a target=\"#\" [href]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n                <img class=\"droplet-preview\" [src]=\"sanitizer.bypassSecurityTrustUrl(image.url)\">\r\n              </a>\r\n\r\n              <div class=\"delete\" (click)=\"removeImage(image.name);\">&times;</div>\r\n              <div class=\"size\">{{image.size / 1024 / 1024 | number}}MB</div>\r\n            </li>\r\n\r\n          </ul>\r\n      \r\n       \r\n        \r\n          </div>\r\n        \r\n        </div>\r\n      </div>\r\n        \r\n      <div class=\"form-group row\">\r\n          <button type=\"submit\" name='button' class='btn btn-success btn-sm' [disabled]='EditFrm.invalid || imageNotReady'>{{saveOrLoading}}</button>\r\n          <button name='button' class='btn btn-default btn-sm' (click)=\"cancelEditing();\">Cancel</button>\r\n      </div>\r\n       \r\n      </div><!-- box closed -->\r\n     \r\n</div> \r\n</form>\r\n\r\n\r\n    \r\n  \r\n    <div *ngIf=\"!toggleForm\">\r\n        <br>\r\n        <h3 class=\"titles\" translate> YourPreviousAd </h3>\r\n      <br>\r\n\r\n      <ul  id = 'PreviousAd' class=\"carsObjects\" style=\"list-style:none\">\r\n\r\n          <li class='memberLi' *ngFor=\"let obj of carsObjects;  let i = index\">\r\n              <!-- <div class=\"container2\" *ngFor=\"let thumb of objs.thums;  let j = index\"> \r\n      \r\n           <div class=\"num_of_img\"> +: {{obj.thums.length}}  </div>\r\n           <img (click)=\"openSlideshow(i,j);\" style=\"width:100px;height:100px;\" [src]=\"obj.thums[j].src\">\r\n\r\n       </div>  -->\r\n\r\n              <!--  <div class=\"container2\" *ngFor=\"let thumb of obj.thums;  let j = index\">  -->\r\n              <div class=\"cardd\">\r\n\r\n\r\n                  <!-- <div class=\"contactBox\"> contact </div> -->\r\n\r\n                  <div class=\"container2 col-md-4\">\r\n                      <div class=\"verticalLine\"></div>\r\n\r\n                      <div class='label label-primary'> {{obj.Manufacturer_name}}> {{obj.Model_name }}>  {{obj.Year}}</div>   <!-- containerTitle -->\r\n                      <br>\r\n                      <br>\r\n\r\n                      \r\n\r\n                      <div class=\"num_of_img\"> +{{obj.Thums.length}} </div>\r\n\r\n                      <img (click)=\"openSlideshow(i,j);\" style=\"width:150px; height:110px;\" [src]=\"obj.Thums[0]\">\r\n                      <br>\r\n                     \r\n                      <br>\r\n                      <div> <i translate>Located:</i> {{obj.City}}> <i translate> Date:</i> {{obj.Date| date :  \"dd MMMM yyyy\" }}</div>\r\n                      <br>\r\n                      <br> \r\n\r\n                  </div>\r\n\r\n                  \r\n          \r\n                  <!-- <div class='col-md-1'>\r\n                      <br><br><br><br>\r\n                    <button type='button' name=\"button\" class='btn btn-danger btn-sm' (click)=\"deleteCar(obj)\" [disabled]=\"toggleForm\">Delete</button>\r\n                  </div> -->\r\n                   \r\n\r\n                  \r\n  \r\n\r\n                  <div class=\"rightOfBox col-md-2\">\r\n\r\n                      <div class='containerPrice'><span translate>Price</span> :  {{obj.Price}} <span translate> AED</span> </div>\r\n\r\n                      <br>\r\n                      <div class='containerKilo'><span translate> Kilometers</span> : {{obj.Kilometers}} <span translate> km</span> </div>\r\n\r\n                      <!-- <br> -->\r\n                      <br>\r\n                      <div class='containerYear'> <span translate>Specs</span> : {{obj.Specs}} </div>\r\n                      <br>\r\n                      <div class='containerYear'><span translate>Cylinder</span> : {{obj.NoOfCylinders}} </div>\r\n                      <br>\r\n                      \r\n                  </div>\r\n\r\n                  <div class='col-md-1'>\r\n                    </div>\r\n\r\n                  <div class=\"rightOfBox col-md-3\">\r\n\r\n                      <div class='containerYear'><span translate>Transmission</span> :  <span  translate>{{obj.Transmission}}</span> </div>\r\n                      <br>\r\n                      <div class='containerYear'><span translate>Color</span> : <span  translate> {{ obj.Color}}</span></div>\r\n                      <br>\r\n                      <div class='containerYear'><span translate>warranty</span> : {{obj.Warranty}} </div>\r\n                      <br>\r\n                      <br>\r\n                      <br>\r\n                      <!-- <div class=\"contactBox\"> Show phone </div> -->\r\n                      <button type='button' name=\"button\" class='btn btn-primary btn-sm'><span translate>ContactNumber</span>: {{obj.ContactNumber}}</button>\r\n                      <br> <br>  \r\n                      \r\n\r\n                  </div>\r\n                 \r\n                  <div class='col-md-1'>\r\n                      <br><br>\r\n                      \r\n                    <button type='button' name=\"button\" class='btn btn-primary btn-sm' (click)=\"showEditForm(obj)\" [disabled]=\"toggleForm\">Edit</button>\r\n               \r\n                  </div>\r\n\r\n                  <div class='col-md-1'>\r\n                      <br><br> \r\n                    <button type='button' name=\"button\" class='btn btn-danger btn-sm' (click)=\"deleteCar(obj)\" [disabled]=\"toggleForm\">Delete</button>\r\n                  </div>\r\n\r\n                  \r\n                 \r\n              </div>\r\n              <hr>\r\n\r\n\r\n          </li>\r\n         \r\n\r\n      </ul>\r\n  </div>\r\n\r\n    <!-- pagination -->\r\n\r\n\r\n  </div>\r\n\r\n  <br>\r\n"

/***/ }),

/***/ "./src/app/upload-form/upload-form.component.ts":
/*!******************************************************!*\
  !*** ./src/app/upload-form/upload-form.component.ts ***!
  \******************************************************/
/*! exports provided: UploadFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadFormComponent", function() { return UploadFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var ng2_img_max__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng2-img-max */ "./node_modules/ng2-img-max/dist/ng2-img-max.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util */ "./src/util.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/auth.service */ "./src/app/core/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/@ngx-translate/core.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import {Http} from '@angular/http';





/* import { Form } from '@angular/forms'; */


var UploadFormComponent = /** @class */ (function () {
    function UploadFormComponent(sanitizer, ng2ImgMax, http, dataService, auth, router, translate) {
        this.sanitizer = sanitizer;
        this.ng2ImgMax = ng2ImgMax;
        this.http = http;
        this.dataService = dataService;
        this.auth = auth;
        this.router = router;
        this.translate = translate;
        this.dropzoneActive = false;
        this.imagePreviews = [];
        //EditFormImagePreviews: preview[] = [];
        this.bigImagePreviews = [];
        //carList: car[] = [];
        this.filesList = [];
        this.toggleForm = false;
        this.imageNotReady = false;
        this.saveOrLoading = 'Save';
        this.goOrLoading = "GO";
        this.firstTime = false;
        this.carsObjects = [];
        this.toggleLanguage = false;
        this.ManufacturersObject = [];
        this.ModelsObject = [];
        this.showModel = false;
        // pager object
        this.pager = {};
        this.cities = ["Abu Dabu", "Ajman", "Al ain", "Dubai", "Fujuira", "Ras Alkhima", "Sharjah", "Um Alquiin"];
        this.specs = ["GCC", "AMERICAN", "JAPANESE", "EUROPE", "OTHER"];
        // paged items
        //pagedItems: any[];
        //fd:FormData[] = [];
        this.fd = new FormData();
        /* editFD = new FormData(); */
        this.time = Date.now() + "_";
        translate.setDefaultLang('en');
    }
    UploadFormComponent.prototype.switchLanguage = function (language) {
        // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
        _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].toggleLanguage = !_util__WEBPACK_IMPORTED_MODULE_5__["Utils"].toggleLanguage;
        this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].toggleLanguage;
        if (_util__WEBPACK_IMPORTED_MODULE_5__["Utils"].toggleLanguage == true)
            this.translate.use('ar');
        else
            this.translate.use('en');
    };
    UploadFormComponent.prototype.onManufacturersChange = function (event) {
        var _this = this;
        console.log('manufatrer chaned' + JSON.stringify(event));
        /*  var x = document.getElementById("noModel");
          x.remove(); */
        if (event != '' && event != 'All') {
            this.showModel = true;
            this.dataService.getModels(event)
                .subscribe(function (models) { _this.ModelsObject = models; });
        }
        else {
            this.showModel = false;
        }
    };
    UploadFormComponent.prototype.dropzoneState = function ($event) {
        this.dropzoneActive = $event;
    };
    UploadFormComponent.prototype.cancelEditing = function () {
        this.toggleForm = !this.toggleForm;
        this.filesList = [];
        this.bigImagePreviews = [];
        // this.EditFormImagePreviews = [];
    };
    UploadFormComponent.prototype.removeImage = function (imageName) {
        this.filesList.forEach(function (name) { return console.log("before " + name.name); });
        var x = this.filesList.length;
        for (var i = 0; i < x; i++) {
            if (this.filesList[i].name === (this.time + "thumb_" + imageName) || this.filesList[i].name === (this.time + imageName)) {
                this.filesList.splice(i, 1);
                i--;
                x--;
            }
            /*  if (  {
             this.filesList.splice(i, 1);
             i--;
             x--;
             } */
            //this.filesList.splice(i, 1);
        }
        for (var i = 0; i < this.bigImagePreviews.length; i++) {
            if (this.bigImagePreviews[i].name === imageName) {
                this.bigImagePreviews.splice(i, 1);
                //this.filesList.splice(i, 1);
                //break;
            }
        }
    };
    UploadFormComponent.prototype.removeImageFromServer = function (imageName) {
        var _this = this;
        this.dataService.deleteImage(imageName).subscribe(function (result) {
            for (var i = 0; i < _this.selectedCar.Thums.length; i++) {
                if (_this.selectedCar.Thums[i] === imageName) {
                    _this.selectedCar.Thums.splice(i, 1);
                    //this.filesList.splice(i, 1);
                    //break;
                }
            }
            // this.getCars();
        });
    };
    UploadFormComponent.prototype.deleteCar = function (car) {
        var _this = this;
        console.log('car id to delte is ' + car.APPLICATION_ID);
        for (var j = 0; j < car.Thums.length; j++) {
            var imageName = car.Thums[j];
            this.dataService.deleteImage(imageName).subscribe(function (result) {
            });
        }
        this.dataService.deleteCar(car.APPLICATION_ID)
            .subscribe(function (data) {
            if (data) {
                for (var i = 0; i < _this.carsObjects.length; i++) {
                    if (car.APPLICATION_ID == _this.carsObjects[i].APPLICATION_ID) {
                        _this.carsObjects.splice(i, 1);
                    }
                }
            }
        });
    };
    UploadFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCars();
        this.translate.onLangChange.subscribe(function (event) {
            _this.toggleLanguage = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].toggleLanguage;
            // do something
        });
        this.dataService.getManufacturers()
            .subscribe(function (manufacturers) {
            _this.ManufacturersObject = manufacturers;
            console.log('manucaturers : ' + JSON.stringify(manufacturers));
        });
    };
    UploadFormComponent.prototype.getCars = function () {
        var _this = this;
        this.auth.user.subscribe(function (user) {
            _this.userDisplayName = user.displayName;
            _this.userEmail = user.email;
            var toSearch = { userID: user.uid };
            var offsetObject = { 'offset': 0 };
            Object.assign(toSearch, offsetObject);
            _this.dataService.getCImages(toSearch)
                .subscribe(function (cars) {
                //this.carList = cars;
                _this.allItems = cars.slice(1, cars.length);
                if (_this.allItems.length !== 0) {
                    _this.getCarsThumbnail();
                }
                // initialize to page 1
                /* if(this.firstTime == false )this.setPage(1);
                 this.firstTime = true;*/
            });
        });
    };
    UploadFormComponent.prototype.getCarsThumbnail = function () {
        //  let im=[];
        this.carsObjects = [];
        var gofiForGallery = [];
        var gofThumbsForShow = [];
        // var arr = input.split(',');
        for (var i = 0; i < this.allItems.length; i++) {
            var gofi = this.allItems[i].gofi;
            // if(gofi) var Gofi = gofi.split(',');else Gofi =[];
            if (gofi)
                var Gofi = gofi;
            else
                Gofi = [];
            for (var j = 0; j < Gofi.length; j++) {
                var thumbForShow = Gofi[j];
                var imgUrl = Gofi[j].replace("_thumb", "");
                var iForGallery = { thumb: thumbForShow, src: imgUrl, w: 1200, h: 900, title: 'image caption sososo ' };
                // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
                gofThumbsForShow.push(thumbForShow);
                gofiForGallery.push(iForGallery);
                // obj=null;
            }
            var carObject = { APPLICATION_ID: this.allItems[i].application_id,
                City: _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertIntToCity(this.allItems[i].emirate),
                Manufacturer: this.allItems[i].manufacter,
                Manufacturer_name: this.allItems[i].manufacture_name,
                Model: this.allItems[i].model,
                Model_name: this.allItems[i].model_name,
                Price: this.allItems[i].price,
                Year: this.allItems[i].year,
                Kilometers: this.allItems[i].miles,
                Specs: _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertIntToSpecs(this.allItems[i].specs),
                NoOfCylinders: this.allItems[i].cylinders,
                Warranty: _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertIntToWaranty(this.allItems[i].waranty),
                Color: _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertIntToColor(this.allItems[i].color),
                Transmission: _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertIntToTransmission(this.allItems[i].transmission),
                ContactNumber: this.allItems[i].phone,
                Date: this.allItems[i].ddate,
                DESCRIPTION: this.allItems[i].details,
                Thums: gofThumbsForShow, Images: gofiForGallery, };
            this.carsObjects.push(carObject);
            gofiForGallery = [];
            gofThumbsForShow = [];
            //  ims.push({'app_id':this.pagedItems[i]},im);
            //this.photoSwipe.openGallery(images,index);
            // this.photoSwipe.openGallery(this.pagedItems,index);
        }
    };
    UploadFormComponent.prototype.EditCar = function (EditFrm) {
        var _this = this;
        this.addForm = EditFrm; ///////////////////////////////////////////////////////////////////////
        // City:EditFrm.value.carcity,
        var city = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertCitytoInt(EditFrm.value.carcity);
        //this.fd.append('city', city.toString());
        /*     let editCar: car = {
            
            APPLICATION_ID: this.selectedCar.APPLICATION_ID,
            City:city,
            Manufacter:EditFrm.value.carmanufacter,
            Model: EditFrm.value.carmodel,
            Price:EditFrm.value.carprice,
            Year:EditFrm.value.caryear,
            Kilometers:EditFrm.value.carkilometers,
            Specs: EditFrm.value.carspecs,
            NoOfCylinders:EditFrm.value.carcylinders,
            Warranty: EditFrm.value.carwarranty,
            Color: EditFrm.value.carcolor,
            Transmission: EditFrm.value.cartransmission,
            ContactNumber: EditFrm.value.carphone,
            
            DESCRIPTION: EditFrm.value.carDESCRIPTION,
            
          } */
        this.fd.append("APPLICATION_ID", this.selectedCar.APPLICATION_ID);
        var city = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertCitytoInt(EditFrm.value.carcity);
        this.fd.append('city', city.toString());
        this.fd.append('manufacturer', EditFrm.value.carmanufacturer);
        this.fd.append('price', EditFrm.value.carprice);
        /*   let  year = Utils.convertYeartoInt(EditFrm.value.caryear); this.fd.append('year', year.toString()); */
        this.fd.append('year', EditFrm.value.caryear);
        this.fd.append('kilometers', EditFrm.value.carkilometers);
        this.fd.append('model', EditFrm.value.carmodel);
        var specs = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertSpecsToInt(EditFrm.value.carspecs);
        this.fd.append('specs', specs.toString());
        this.fd.append('cylinders', EditFrm.value.carcylinders);
        var waranty = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertWarantyToInt(EditFrm.value.carwarranty);
        this.fd.append('warranty', waranty.toString());
        var color = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertColorToInt(EditFrm.value.carcolor);
        this.fd.append('color', color.toString());
        var transmission = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertTransmissionToInt(EditFrm.value.cartransmission);
        this.fd.append('transmission', transmission.toString());
        this.fd.append('phone', EditFrm.value.carphone);
        this.fd.append('description', EditFrm.value.cardescription);
        this.auth.user.subscribe(function (user) {
            if (user) {
                var userId = user.uid;
                _this.fd.append('uid', userId);
                _this.upload();
                _this.filesList = [];
            }
        });
        // this.dataService.updateCar(editCar)
        //  let editFormData;
        /*  this.dataService.updateCar(editCar.APPLICATION_ID,editFormData)
             .subscribe(result => {
               
               this.getCars();
             });
       **/
        this.toggleForm = !this.toggleForm;
        this.bigImagePreviews = [];
    };
    UploadFormComponent.prototype.showEditForm = function (car) {
        window.scrollTo(0, 0);
        this.selectedCar = car;
        this.toggleForm = !this.toggleForm;
        this.filesList = [];
        this.bigImagePreviews = [];
    };
    UploadFormComponent.prototype.onImageChange = function (event) {
        var files = event.target.files;
        this.resizeFiles(files);
    };
    UploadFormComponent.prototype.handleDrop = function (fileList) {
        this.resizeFiles(fileList);
    };
    UploadFormComponent.prototype.addCar = function (frm) {
        var _this = this;
        this.addForm = frm;
        var city = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertCitytoInt(frm.value.carCity);
        this.fd.append('city', city.toString());
        this.fd.append('manufacturer', frm.value.carManufacturer);
        this.fd.append('price', frm.value.carPrice);
        var year = this.fd.append('year', frm.value.carYear);
        this.fd.append('kilometers', frm.value.carKilometers);
        this.fd.append('model', frm.value.carModel);
        var specs = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertSpecsToInt(frm.value.carSpecs);
        this.fd.append('specs', specs.toString());
        this.fd.append('cylinders', frm.value.carCylinders);
        var waranty = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertWarantyToInt(frm.value.carWarranty);
        this.fd.append('warranty', waranty.toString());
        var color = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertColorToInt(frm.value.carColor);
        this.fd.append('color', color.toString());
        var transmission = _util__WEBPACK_IMPORTED_MODULE_5__["Utils"].convertTransmissionToInt(frm.value.cartransmission);
        this.fd.append('transmission', transmission.toString());
        this.fd.append('phone', frm.value.carPhone);
        this.fd.append('description', frm.value.carDESCRIPTION);
        this.auth.user.subscribe(function (user) {
            if (user) {
                var userId = user.uid;
                _this.fd.append('uid', userId);
                _this.upload();
            }
        });
    };
    UploadFormComponent.prototype.resizeFiles = function (files) {
        var _this = this;
        var resultCounter = 0;
        for (var i = 0; i < files.length; i++) {
            this.imageNotReady = true;
            this.saveOrLoading = 'loading';
            this.goOrLoading = 'loading';
            var image = files[i];
            //this.fd.append('image', image, this.time + image.name);
            this.filesList.push({ theFile: image, name: this.time + image.name });
            this.getbigImagePreview(image);
            this.ng2ImgMax.resizeImage(image, 100, 10000).subscribe(function (result) {
                _this.uploadedImage = new File([result], _this.time + "thumb_" + result.name);
                resultCounter++;
                console.log("result counter = " + resultCounter);
                _this.getImagePreview(_this.uploadedImage);
                //var singleFd = new FormData();
                //singleFd.append('image', this.uploadedImage, this.uploadedImage.name);
                //this.fd.push(singleFd);
                //this.fd.append('image', this.uploadedImage, this.uploadedImage.name);
                _this.filesList.push({ theFile: _this.uploadedImage, name: _this.uploadedImage.name });
                console.log("i is :" + resultCounter);
                console.log("lenth is :" + files.length);
                if (resultCounter == files.length) {
                    console.log("hi :" + resultCounter);
                    _this.imageNotReady = false;
                    _this.saveOrLoading = 'Save';
                    _this.goOrLoading = 'GO';
                }
                // this.upload();
            }, function (error) {
                console.log('😢 Oh no!', error);
            });
        }
    };
    UploadFormComponent.prototype.getImagePreview = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            /*   if(this.toggleForm) {
                
                this.EditFormImagePreviews.push({ url: reader.result, name: file.name, size: file.size });
              } else  */
            _this.imagePreviews.push({ url: reader.result, name: file.name, size: file.size });
        };
    };
    UploadFormComponent.prototype.getbigImagePreview = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            /*  if(this.toggleForm) {
               
              // this.EditFormImagePreviews.push({ url: reader.result, name: file.name, size: file.size });
             } else  */
            _this.bigImagePreviews.push({ url: reader.result, name: file.name, size: file.size });
        };
    };
    UploadFormComponent.prototype.upload = function () {
        var _this = this;
        for (var i = 0; i < this.filesList.length; i++) {
            this.fd.append('image', this.filesList[i].theFile, this.filesList[i].name);
        }
        var app_id = '0';
        if (this.fd.has("APPLICATION_ID")) {
            app_id = this.selectedCar.APPLICATION_ID;
        }
        // else url =  "http://localhost:3000/api/setimg/0";
        console.log('app id is : ' + app_id);
        this.http.post("api/setimg/" + app_id, this.fd, {
            reportProgress: true,
            observe: 'events',
        })
            .subscribe(function (event) {
            if (event.type === _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpEventType"].UploadProgress) {
                _this.uploadProgress = Math.round(event.loaded / event.total * 100) - 10;
            }
            else if (event.type === _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpEventType"].Response) {
                if (event.statusText == 'OK') {
                    _this.addForm.reset();
                    _this.imagePreviews = [];
                    _this.bigImagePreviews = [];
                    _this.fd.delete("APPLICATION_ID");
                    _this.fd.delete("image");
                    _this.fd.delete("city");
                    _this.fd.delete("manufacturer");
                    _this.fd.delete("model");
                    _this.fd.delete("price");
                    _this.fd.delete("year");
                    _this.fd.delete("kilometers");
                    _this.fd.delete("specs");
                    _this.fd.delete("cylinders");
                    _this.fd.delete("warranty");
                    _this.fd.delete("color");
                    _this.fd.delete("transmission");
                    _this.fd.delete("phone");
                    _this.fd.delete("description");
                    _this.fd.delete("uid");
                    _this.filesList = [];
                    _this.time = Date.now() + "_";
                    _this.uploadProgress = 0;
                    alert("added successfully");
                    _this.getCars();
                }
            }
        }, function (error) {
            alert('😢 Oh no! ' + JSON.stringify(error));
            console.log(error);
            _this.addForm.reset();
            _this.imagePreviews = [];
            _this.bigImagePreviews = [];
            _this.fd.delete("APPLICATION_ID");
            _this.fd.delete("image");
            _this.fd.delete("city");
            _this.fd.delete("manufacturer");
            _this.fd.delete("model");
            _this.fd.delete("price");
            _this.fd.delete("year");
            _this.fd.delete("kilometers");
            _this.fd.delete("specs");
            _this.fd.delete("cylinders");
            _this.fd.delete("warranty");
            _this.fd.delete("color");
            _this.fd.delete("transmission");
            _this.fd.delete("phone");
            _this.fd.delete("description");
            _this.fd.delete("uid");
            _this.filesList = [];
            _this.time = Date.now() + "_";
            _this.uploadProgress = 0;
        });
    };
    UploadFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'upload-form',
            template: __webpack_require__(/*! ./upload-form.component.html */ "./src/app/upload-form/upload-form.component.html"),
            styles: [__webpack_require__(/*! ./upload-form.component.css */ "./src/app/upload-form/upload-form.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"],
            ng2_img_max__WEBPACK_IMPORTED_MODULE_2__["Ng2ImgMaxService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"],
            _data_service__WEBPACK_IMPORTED_MODULE_6__["DataService"],
            _core_auth_service__WEBPACK_IMPORTED_MODULE_7__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__["TranslateService"]])
    ], UploadFormComponent);
    return UploadFormComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.convertCitytoInt = function (val) {
        switch (val) {
            case "Abu Dhabi": return 1;
            case "Ajman": return 2;
            case "Alain": return 3;
            case "Dubai": return 4;
            case "Fujaira": return 5;
            case "Ras Alkhaima": return 6;
            case "Sharjah": return 7;
            case "Um Alqwain": return 8;
            default: return 0;
        }
    };
    Utils.convertIntToCity = function (val) {
        switch (val) {
            case 1: return "Abu Dhabi";
            case 2: return "Ajman";
            case 3: return "Alain";
            case 4: return "Dubai";
            case 5: return "Fujaira";
            case 6: return "Ras Alkhaima";
            case 7: return "Sharjah";
            case 8: return "Um Alqwain";
            default: return 0;
        }
    };
    Utils.convertColorToInt = function (val) {
        switch (val) {
            case "Silver": return 1;
            case "White": return 2;
            case "Brown": return 3;
            case "Black": return 4;
            case "Blue": return 5;
            case "Red": return 6;
            case "Gray": return 7;
            case "Green": return 8;
            case "Gold": return 9;
            case "Yellow": return 10;
            case "Other": return 11;
            default: return -1;
        }
    };
    Utils.convertIntToColor = function (val) {
        switch (val) {
            case 1: return "Silver";
            case 2: return "White";
            case 3: return "Brown";
            case 4: return "Black";
            case 5: return "Blue";
            case 6: return "Red";
            case 7: return "Gray";
            case 8: return "Green";
            case 9: return "Gold";
            case 10: return "Yellow";
            default: return "Other";
        }
    };
    Utils.convertWarantyToInt = function (val) {
        switch (val) {
            case "YES": return 1;
            case "NO": return 2;
            case "DOESN'T APPLY": return 3;
            default: return 0;
        }
    };
    Utils.convertIntToWaranty = function (val) {
        switch (val) {
            case 1: return "YES";
            case 2: return "NO";
            case 3: return "DOESN'T APPLY";
            default: return 0;
        }
    };
    Utils.convertIntToTransmission = function (val) {
        switch (val) {
            case 1: return "Automatic";
            case 2: return "Manual";
            case 3: return "Hybrid";
            default: return 0;
        }
    };
    Utils.convertTransmissionToInt = function (val) {
        switch (val) {
            case "Automatic": return 1;
            case "Manual": return 2;
            case "Hybrid": return 3;
            default: return 0;
        }
    };
    Utils.convertDatetoShow = function (val) {
        //var date = '1475235770601';
        var d = new Date(parseInt(val, 10));
        var ds = d.toLocaleString();
        console.log(ds);
    };
    Utils.convertSpecsToInt = function (val) {
        switch (val) {
            case "GCC": return 1;
            case "AMERICAN": return 2;
            case "JAPANESE": return 3;
            case "EUROPE": return 4;
            case "OTHER": return 5;
            default: return 0;
        }
    };
    Utils.convertIntToSpecs = function (val) {
        switch (val) {
            case 1: return "GCC";
            case 2: return "AMERICAN";
            case 3: return "JAPANESE";
            case 4: return "EUROPE";
            case 5: return "OTHER";
            default: return 0;
        }
    };
    Utils.toggleLanguage = false;
    return Utils;
}());



/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\Aminov\Desktop\angular-motorat\motoratSql\motorat-frontend\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map