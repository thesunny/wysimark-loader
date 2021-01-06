'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

/**
 * Tries to grab the module from the cache if we are on the browser. Always
 * returns undefined on the server because the cache only exists on the
 * window object in the browser.
 *
 * @param url
 */
function getMaybeModule(url) {
    if (typeof window === "undefined")
        return undefined;
    /**
     * Make sure there is a cache object
     */
    if (typeof window.__externalModule_cache__ === "undefined") {
        window.__externalModule_context__ = { React: React__default['default'], ReactDOM: ReactDOM__default['default'] };
        window.__externalModule_cache__ = {};
    }
    /**
     * If the module is in the cache, return it right away
     */
    const maybeModule = window.__externalModule_cache__[url];
    return maybeModule;
}
/**
 * Loads a JavaScript file asynchronously.
 *
 * The file should be an IIFE that assigns a value to the `window` object.
 *
 * Our current practice is to use rollup config where `format: "iife"` and we
 * set `name: "THE_MODULE_KEY"` which is passed in as the second argument.
 *
 * From the library file, we also export a type named something like
 * `MyNameModule` which is passed in as the generic to this `loadModule`
 * method so we know what types we are getting.
 *
 * @param url URL to a .js file where the module is loaded from
 * @param moduleKey The `name` in the `window` namespace to grab the module from
 */
function loadExternalModule(url, moduleKey) {
    const maybeModule = getMaybeModule(url);
    if (maybeModule) {
        return Promise.resolve(maybeModule);
    }
    /**
     * Create the script tag and append it to the document
     */
    const script = document.createElement("script");
    script.src = url;
    script.id = "dynamic_hello";
    document.body.appendChild(script);
    return new Promise((resolve, reject) => {
        script.onload = () => {
            const mod = window[moduleKey];
            if (mod == null) {
                console.error(`Loaded script ${JSON.stringify(url)} but it did not set window.${moduleKey}`);
                return;
            }
            if (typeof window.__externalModule_cache__ === "undefined") {
                window.__externalModule_cache__ = {};
            }
            window.__externalModule_cache__[url] = mod;
            resolve(mod);
        };
    });
}
/**
 * Default value for loading an external module (less the URL).
 *
 * Useful because there are two places where this structure is used.
 */
const DEFAULT_LOADING_EXTERNAL_MODULE = {
    ready: false,
    cached: false,
    spinner: false,
    module: undefined,
};
/**
 * Loads a module from a URL. The module will define a variable in the window
 * namespace.
 *
 * When the module has been loaded, we grab the variable from the window
 * namespace and return it.
 *
 * It also returns a `ready` state. If the module is ready, you know that
 * the `module` property is defined in the return value.
 *
 * @param url URL to a .js file where the module is loaded from
 * @param moduleKey The `name` in the `window` namespace to grab the module from
 */
function useExternalModule(url, moduleKey) {
    /**
     * Try grabbing the module from the cache during the initial setting of
     * state.
     */
    const [externalModule, setState] = React.useState(() => {
        const maybeModule = getMaybeModule(url);
        if (maybeModule) {
            return {
                url,
                ready: true,
                cached: true,
                spinner: false,
                module: maybeModule,
            };
        }
        else {
            return { url, ...DEFAULT_LOADING_EXTERNAL_MODULE };
        }
    });
    /**
     * When the URL changes, we want to reset the state.
     *
     * We were able to simplify the logic a lot by moving this out of `useEffect`
     * where it was causing a lot of timing related issues.
     */
    if (url !== externalModule.url) {
        setState({ url, ...DEFAULT_LOADING_EXTERNAL_MODULE });
    }
    React.useEffect(() => {
        if (externalModule.cached)
            return;
        /**
         * It's been a while so show the loading indicator
         */
        const timeoutId = setTimeout(() => {
            setState({
                url: externalModule.url,
                ready: false,
                cached: false,
                spinner: true,
                module: undefined,
            });
        }, 1000);
        /**
         * Once it's loaded, set ready to true and turn off the loading indicator
         */
        loadExternalModule(url, moduleKey).then(function (mod) {
            clearTimeout(timeoutId);
            setState({
                url: externalModule.url,
                ready: true,
                cached: false,
                spinner: false,
                module: mod,
            });
        });
        /**
         * If the URL changes, start from scratch again
         */
        return function () {
            console.log("unload?");
            setState({
                url: externalModule.url,
                ready: false,
                cached: false,
                spinner: false,
                module: undefined,
            });
        };
    }, [externalModule.url]);
    return externalModule;
}

/**
 * Placeholder container designe to mimic the editor.
 */
const PLACEHOLDER_CSS = `
.--wysimark-placeholder-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid silver;
  border-radius: 4;
  padding: 10;
  box-sizing: border-box;
}
`;
/**
 * Spinner animation. Inspired by:
 *
 * https://codepen.io/nzbin/pen/GGrXbp
 */
const SPINNER_CSS = `
@keyframes wysimarkLoading {
  0%,
  50% {
    opacity: 0.1;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
  
.--wysimark-placeholder-spinner {
  padding-bottom: 24px;
}

.--wysimark-placeholder-spinner .dot-flashing {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 0.5em;
  background-color: #ddd;
  animation: wysimarkLoading 0.6s infinite ease alternate;
  opacity: 0.1;
  margin: 0 2px;
  transform: scale(1);
}

.--wysimark-placeholder-spinner .dot-flashing-1 {
  animation-delay: -0.2s;
}

.--wysimark-placeholder-spinner .dot-flashing-2 {
  animation-delay: 0s;
}

.--wysimark-placeholder-spinner .dot-flashing-3 {
  animation-delay: 0.2s;
}
`;
const CSS = `${PLACEHOLDER_CSS}${SPINNER_CSS}`;
/**
 * Placeholder component with optional spinner.
 */
function Placeholder({ minHeight, spinner, }) {
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement("style", null, CSS),
        React__default['default'].createElement("div", { className: "--wysimark-placeholder-container", style: { height: minHeight } }, spinner ? (React__default['default'].createElement("div", { className: "--wysimark-placeholder-spinner" },
            React__default['default'].createElement("div", { className: "dot-flashing dot-flashing-1" }),
            React__default['default'].createElement("div", { className: "dot-flashing dot-flashing-2" }),
            React__default['default'].createElement("div", { className: "dot-flashing dot-flashing-3" }))) : null)));
}

/**
 * This allows you to create the `wysimark` object that you passs into the
 * `Wysimark` component.
 *
 * This object is important because it exposes the method `getMarkdown` which
 * you need to extract the markdown.
 */
function useEditor(initialMarkdown) {
    const getMarkdownRef = React.useRef();
    function getMarkdown() {
        if (getMarkdownRef.current == null) {
            throw new Error("Expected getMarkdownRef.current to have a value");
        }
        return getMarkdownRef.current();
    }
    return { getMarkdownRef, getMarkdown, initialMarkdown };
}
/**
 * The lazily loaded Wysimark component to place in an app.
 */
function Editor({ editor, minHeight = 240, maxHeight, scriptUrl = "https://admin.wysimark.com/build/wysimark.js", uploadPolicyUrl, app, folder, }) {
    const external = useExternalModule(scriptUrl, "__wysimark__");
    if (external.ready) {
        const { Wysimark: Editor } = external.module;
        return (React__default['default'].createElement(Editor, { showInitial: !external.cached, getMarkdownRef: editor.getMarkdownRef, initialMarkdown: editor.initialMarkdown, minHeight: minHeight, maxHeight: maxHeight, app: app, folder: folder, uploadPolicyUrl: uploadPolicyUrl }));
    }
    else {
        return React__default['default'].createElement(Placeholder, { minHeight: minHeight, spinner: external.spinner });
    }
}

exports.Editor = Editor;
exports.useEditor = useEditor;
//# sourceMappingURL=index.js.map
