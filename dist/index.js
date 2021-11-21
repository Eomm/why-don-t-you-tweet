require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormDataHelper = void 0;
const helpers_1 = __nccwpck_require__(1120);
// This class is partially inspired by https://github.com/form-data/form-data/blob/master/lib/form_data.js
// All credits to their authors.
class FormDataHelper {
    constructor() {
        this._boundary = '';
        this._chunks = [];
    }
    bodyAppend(...values) {
        const allAsBuffer = values.map(val => val instanceof Buffer ? val : Buffer.from(val));
        this._chunks.push(...allAsBuffer);
    }
    append(field, value, contentType) {
        const convertedValue = value instanceof Buffer ? value : value.toString();
        const header = this.getMultipartHeader(field, convertedValue, contentType);
        this.bodyAppend(header, convertedValue, FormDataHelper.LINE_BREAK);
    }
    getHeaders() {
        return {
            'content-type': 'multipart/form-data; boundary=' + this.getBoundary(),
        };
    }
    /** Length of form-data (including footer length). */
    getLength() {
        return this._chunks.reduce((acc, cur) => acc + cur.length, this.getMultipartFooter().length);
    }
    getBuffer() {
        const allChunks = [...this._chunks, this.getMultipartFooter()];
        const totalBuffer = Buffer.alloc(this.getLength());
        let i = 0;
        for (const chunk of allChunks) {
            for (let j = 0; j < chunk.length; i++, j++) {
                totalBuffer[i] = chunk[j];
            }
        }
        return totalBuffer;
    }
    getBoundary() {
        if (!this._boundary) {
            this.generateBoundary();
        }
        return this._boundary;
    }
    generateBoundary() {
        // This generates a 50 character boundary similar to those used by Firefox.
        let boundary = '--------------------------';
        for (let i = 0; i < 24; i++) {
            boundary += Math.floor(Math.random() * 10).toString(16);
        }
        this._boundary = boundary;
    }
    getMultipartHeader(field, value, contentType) {
        // In this lib no need to guess more the content type, octet stream is ok of buffers
        if (!contentType) {
            contentType = value instanceof Buffer ? FormDataHelper.DEFAULT_CONTENT_TYPE : '';
        }
        const headers = {
            'Content-Disposition': ['form-data', `name="${field}"`],
            'Content-Type': contentType,
        };
        let contents = '';
        for (const [prop, header] of Object.entries(headers)) {
            // skip nullish headers.
            if (!header.length) {
                continue;
            }
            contents += prop + ': ' + helpers_1.arrayWrap(header).join('; ') + FormDataHelper.LINE_BREAK;
        }
        return '--' + this.getBoundary() + FormDataHelper.LINE_BREAK + contents + FormDataHelper.LINE_BREAK;
    }
    getMultipartFooter() {
        if (this._footerChunk) {
            return this._footerChunk;
        }
        return this._footerChunk = Buffer.from('--' + this.getBoundary() + '--' + FormDataHelper.LINE_BREAK);
    }
}
exports.FormDataHelper = FormDataHelper;
FormDataHelper.LINE_BREAK = '\r\n';
FormDataHelper.DEFAULT_CONTENT_TYPE = 'application/octet-stream';


/***/ }),

/***/ 8291:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OAuth1Helper = void 0;
const crypto = __importStar(__nccwpck_require__(6417));
class OAuth1Helper {
    constructor(options) {
        this.nonceLength = 32;
        this.consumerKeys = options.consumerKeys;
    }
    hash(base, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base)
            .digest('base64');
    }
    authorize(request, accessTokens = {}) {
        const oauthInfo = {
            oauth_consumer_key: this.consumerKeys.key,
            oauth_nonce: this.getNonce(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: this.getTimestamp(),
            oauth_version: '1.0',
        };
        if (accessTokens.key !== undefined) {
            oauthInfo.oauth_token = accessTokens.key;
        }
        if (!request.data) {
            request.data = {};
        }
        oauthInfo.oauth_signature = this.getSignature(request, accessTokens.secret, oauthInfo);
        return oauthInfo;
    }
    toHeader(oauthInfo) {
        const sorted = sortObject(oauthInfo);
        let header_value = 'OAuth ';
        for (const element of sorted) {
            if (element.key.indexOf('oauth_') !== 0) {
                continue;
            }
            header_value += percentEncode(element.key) + '="' + percentEncode(element.value) + '",';
        }
        return {
            // Remove the last ,
            Authorization: header_value.slice(0, header_value.length - 1),
        };
    }
    getNonce() {
        const wordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < this.nonceLength; i++) {
            result += wordCharacters[Math.trunc(Math.random() * wordCharacters.length)];
        }
        return result;
    }
    getTimestamp() {
        return Math.trunc(new Date().getTime() / 1000);
    }
    getSignature(request, tokenSecret, oauthInfo) {
        return this.hash(this.getBaseString(request, oauthInfo), this.getSigningKey(tokenSecret));
    }
    getSigningKey(tokenSecret) {
        return percentEncode(this.consumerKeys.secret) + '&' + percentEncode(tokenSecret || '');
    }
    getBaseString(request, oauthInfo) {
        return request.method.toUpperCase() + '&'
            + percentEncode(this.getBaseUrl(request.url)) + '&'
            + percentEncode(this.getParameterString(request, oauthInfo));
    }
    getParameterString(request, oauthInfo) {
        const baseStringData = sortObject(percentEncodeData(mergeObject(oauthInfo, mergeObject(request.data, deParamUrl(request.url)))));
        let dataStr = '';
        for (const { key, value } of baseStringData) {
            // check if the value is an array
            // this means that this key has multiple values
            if (value && Array.isArray(value)) {
                // sort the array first
                value.sort();
                let valString = '';
                // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
                value.forEach((item, i) => {
                    valString += key + '=' + item;
                    if (i < value.length) {
                        valString += '&';
                    }
                });
                dataStr += valString;
            }
            else {
                dataStr += key + '=' + value + '&';
            }
        }
        // Remove the last character
        return dataStr.slice(0, dataStr.length - 1);
    }
    getBaseUrl(url) {
        return url.split('?')[0];
    }
}
exports.OAuth1Helper = OAuth1Helper;
exports.default = OAuth1Helper;
// Helper functions //
function mergeObject(obj1, obj2) {
    return {
        ...obj1 || {},
        ...obj2 || {},
    };
}
function sortObject(data) {
    return Object.keys(data)
        .sort()
        .map(key => ({ key, value: data[key] }));
}
function deParam(string) {
    const splitted = string.split('&');
    const data = {};
    for (const coupleKeyValue of splitted) {
        const [key, value = ''] = coupleKeyValue.split('=');
        // check if the key already exists
        // this can occur if the QS part of the url contains duplicate keys like this: ?formkey=formvalue1&formkey=formvalue2
        if (data[key]) {
            // the key exists already
            if (!Array.isArray(data[key])) {
                // replace the value with an array containing the already present value
                data[key] = [data[key]];
            }
            // and add the new found value to it
            data[key].push(decodeURIComponent(value));
        }
        else {
            // it doesn't exist, just put the found value in the data object
            data[key] = decodeURIComponent(value);
        }
    }
    return data;
}
function deParamUrl(url) {
    const tmp = url.split('?');
    if (tmp.length === 1)
        return {};
    return deParam(tmp[1]);
}
function percentEncode(str) {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/\*/g, '%2A')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
}
function percentEncodeData(data) {
    const result = {};
    for (const key in data) {
        let value = data[key];
        // check if the value is an array
        if (value && Array.isArray(value)) {
            value = value.map(v => percentEncode(v));
        }
        else {
            value = percentEncode(value);
        }
        result[percentEncode(key)] = value;
    }
    return result;
}


/***/ }),

/***/ 9791:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OAuth2Helper = void 0;
const crypto = __importStar(__nccwpck_require__(6417));
class OAuth2Helper {
    static getCodeVerifier() {
        return this.generateRandomString(128);
    }
    static getCodeChallengeFromVerifier(verifier) {
        return this.escapeBase64Url(crypto
            .createHash('sha256')
            .update(verifier)
            .digest('base64'));
    }
    static generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        for (let i = 0; i < length; i++) {
            text += possible[Math.floor(Math.random() * possible.length)];
        }
        return text;
    }
    static escapeBase64Url(string) {
        return string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
}
exports.OAuth2Helper = OAuth2Helper;


/***/ }),

/***/ 3768:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestHandlerHelper = void 0;
const https_1 = __nccwpck_require__(7211);
const settings_1 = __nccwpck_require__(6273);
const TweetStream_1 = __importDefault(__nccwpck_require__(9362));
const types_1 = __nccwpck_require__(1638);
class RequestHandlerHelper {
    constructor(requestData) {
        this.requestData = requestData;
        this.responseData = '';
    }
    get hrefPathname() {
        const url = this.requestData.url;
        return url.hostname + url.pathname;
    }
    isFormEncodedEndpoint() {
        return this.requestData.url.href.startsWith('https://api.twitter.com/oauth/');
    }
    getRateLimitFromResponse(res) {
        let rateLimit = undefined;
        if (res.headers['x-rate-limit-limit']) {
            rateLimit = {
                limit: Number(res.headers['x-rate-limit-limit']),
                remaining: Number(res.headers['x-rate-limit-remaining']),
                reset: Number(res.headers['x-rate-limit-reset']),
            };
            if (this.requestData.rateLimitSaver) {
                this.requestData.rateLimitSaver(rateLimit);
            }
        }
        return rateLimit;
    }
    createRequestError(error) {
        if (settings_1.TwitterApiV2Settings.debug) {
            console.log('Request network error:', error);
        }
        return new types_1.ApiRequestError('Request failed.', {
            request: this.req,
            error,
        });
    }
    formatV1Errors(errors) {
        return errors
            .map(({ code, message }) => `${message} (Twitter code ${code})`)
            .join(', ');
    }
    formatV2Error(error) {
        return `${error.title}: ${error.detail} (see ${error.type})`;
    }
    createResponseError({ res, data, rateLimit, code }) {
        var _a;
        if (settings_1.TwitterApiV2Settings.debug) {
            console.log('Request failed with code', code, ', data:', data, 'response headers:', res.headers);
        }
        // Errors formatting.
        let errorString = `Request failed with code ${code}`;
        if ((_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0 ? void 0 : _a.length) {
            const errors = data.errors;
            if ('code' in errors[0]) {
                errorString += ' - ' + this.formatV1Errors(errors);
            }
            else {
                errorString += ' - ' + this.formatV2Error(data);
            }
        }
        return new types_1.ApiResponseError(errorString, {
            code,
            data,
            headers: res.headers,
            request: this.req,
            response: res,
            rateLimit,
        });
    }
    getParsedResponse(res) {
        var _a;
        let data = this.responseData;
        // Auto parse if server responds with JSON body
        if (data.length && ((_a = res.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
            data = JSON.parse(data);
        }
        // f-e oauth token endpoints
        else if (this.isFormEncodedEndpoint()) {
            const response_form_entries = {};
            for (const [item, value] of new URLSearchParams(data)) {
                response_form_entries[item] = value;
            }
            data = response_form_entries;
        }
        return data;
    }
    requestErrorHandler(reject, requestError) {
        reject(this.createRequestError(requestError));
    }
    classicResponseHandler(resolve, reject, res) {
        // Register the response data
        res.on('data', chunk => this.responseData += chunk);
        res.on('end', this.onResponseEndHandler.bind(this, resolve, reject, res));
    }
    onResponseEndHandler(resolve, reject, res) {
        const rateLimit = this.getRateLimitFromResponse(res);
        const data = this.getParsedResponse(res);
        // Handle bad error codes
        const code = res.statusCode;
        if (code >= 400) {
            reject(this.createResponseError({ data, res, rateLimit, code }));
        }
        if (settings_1.TwitterApiV2Settings.debug) {
            console.log(`[${this.requestData.options.method} ${this.hrefPathname}]: Request succeeds with code ${res.statusCode}`);
            console.log('Response body:', data);
        }
        resolve({
            data,
            headers: res.headers,
            rateLimit,
        });
    }
    streamResponseHandler(resolve, reject, res) {
        const code = res.statusCode;
        if (code < 400) {
            if (settings_1.TwitterApiV2Settings.debug) {
                console.log(`[${this.requestData.options.method} ${this.hrefPathname}]: Request succeeds with code ${res.statusCode} (starting stream)`);
            }
            // HTTP code ok, consume stream
            resolve({ req: this.req, res, requestData: this.requestData });
        }
        else {
            // Handle response normally, can only rejects
            this.classicResponseHandler(() => undefined, reject, res);
        }
    }
    debugRequest() {
        const url = this.requestData.url;
        console.log(`[${this.requestData.options.method} ${this.hrefPathname}]`, this.requestData.options);
        if (url.search) {
            console.log('Request parameters:', [...url.searchParams.entries()].map(([key, value]) => `${key}: ${value}`));
        }
        if (this.requestData.body) {
            console.log('Request body:', this.requestData.body);
        }
    }
    buildRequest() {
        if (settings_1.TwitterApiV2Settings.debug) {
            this.debugRequest();
        }
        const url = this.requestData.url;
        const auth = url.username ? `${url.username}:${url.password}` : undefined;
        this.req = https_1.request({
            ...this.requestData.options,
            // Define URL params manually, addresses dependencies error https://github.com/PLhery/node-twitter-api-v2/issues/94
            host: url.hostname,
            port: url.port || undefined,
            path: url.pathname + url.search,
            protocol: url.protocol,
            auth,
        });
    }
    makeRequest() {
        this.buildRequest();
        return new Promise((resolve, reject) => {
            const req = this.req;
            // Handle request errors
            req.on('error', this.requestErrorHandler.bind(this, reject));
            req.on('response', this.classicResponseHandler.bind(this, resolve, reject));
            if (this.requestData.body) {
                req.write(this.requestData.body);
            }
            req.end();
        });
    }
    async makeRequestAsStream() {
        const { req, res, requestData } = await this.makeRequestAndResolveWhenReady();
        return new TweetStream_1.default(requestData, req, res);
    }
    makeRequestAndResolveWhenReady() {
        this.buildRequest();
        return new Promise((resolve, reject) => {
            const req = this.req;
            // Handle request errors
            req.on('error', this.requestErrorHandler.bind(this, reject));
            req.on('response', this.streamResponseHandler.bind(this, resolve, reject));
            if (this.requestData.body) {
                req.write(this.requestData.body);
            }
            req.end();
        });
    }
}
exports.RequestHandlerHelper = RequestHandlerHelper;
exports.default = RequestHandlerHelper;


/***/ }),

/***/ 6131:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientRequestMaker = void 0;
const TweetStream_1 = __importDefault(__nccwpck_require__(9362));
const helpers_1 = __nccwpck_require__(1120);
const oauth1_helper_1 = __importDefault(__nccwpck_require__(8291));
const request_handler_helper_1 = __importDefault(__nccwpck_require__(3768));
const request_param_helper_1 = __importDefault(__nccwpck_require__(7954));
class ClientRequestMaker {
    constructor() {
        this._rateLimits = {};
    }
    saveRateLimit(originalUrl, rateLimit) {
        this._rateLimits[originalUrl] = rateLimit;
    }
    /** Send a new request and returns a wrapped `Promise<TwitterResponse<T>`. */
    send(requestParams) {
        const args = this.getHttpRequestArgs(requestParams);
        const options = { method: args.method, headers: args.headers, timeout: requestParams.timeout };
        const enableRateLimitSave = requestParams.enableRateLimitSave !== false;
        if (args.body) {
            request_param_helper_1.default.setBodyLengthHeader(options, args.body);
        }
        return new request_handler_helper_1.default({
            url: args.url,
            options,
            body: args.body,
            rateLimitSaver: enableRateLimitSave ? this.saveRateLimit.bind(this, args.rawUrl) : undefined,
        })
            .makeRequest();
    }
    sendStream(requestParams) {
        const args = this.getHttpRequestArgs(requestParams);
        const options = { method: args.method, headers: args.headers };
        const enableRateLimitSave = requestParams.enableRateLimitSave !== false;
        const enableAutoConnect = requestParams.autoConnect !== false;
        if (args.body) {
            request_param_helper_1.default.setBodyLengthHeader(options, args.body);
        }
        const requestData = {
            url: args.url,
            options,
            body: args.body,
            rateLimitSaver: enableRateLimitSave ? this.saveRateLimit.bind(this, args.rawUrl) : undefined,
            payloadIsError: requestParams.payloadIsError,
        };
        const stream = new TweetStream_1.default(requestData);
        if (!enableAutoConnect) {
            return stream;
        }
        return stream.connect();
    }
    /* Token helpers */
    buildOAuth() {
        if (!this._consumerSecret || !this._consumerToken)
            throw new Error('Invalid consumer tokens');
        return new oauth1_helper_1.default({
            consumerKeys: { key: this._consumerToken, secret: this._consumerSecret },
        });
    }
    getOAuthAccessTokens() {
        if (!this._accessSecret || !this._accessToken)
            return;
        return {
            key: this._accessToken,
            secret: this._accessSecret,
        };
    }
    /* Request helpers */
    writeAuthHeaders({ headers, bodyInSignature, url, method, query, body }) {
        headers = { ...headers };
        if (this._bearerToken) {
            headers.Authorization = 'Bearer ' + this._bearerToken;
        }
        else if (this._basicToken) {
            // Basic auth, to request a bearer token
            headers.Authorization = 'Basic ' + this._basicToken;
        }
        else if (this._consumerSecret && this._oauth) {
            // Merge query and body
            const data = bodyInSignature ? request_param_helper_1.default.mergeQueryAndBodyForOAuth(query, body) : query;
            const auth = this._oauth.authorize({
                url: url.toString(),
                method,
                data,
            }, this.getOAuthAccessTokens());
            headers = { ...headers, ...this._oauth.toHeader(auth) };
        }
        return headers;
    }
    getHttpRequestArgs({ url, method, query: rawQuery = {}, body: rawBody = {}, headers, forceBodyMode, enableAuth, params, }) {
        let body = undefined;
        method = method.toUpperCase();
        headers = headers !== null && headers !== void 0 ? headers : {};
        // Add user agent header (Twitter recommands it)
        if (!headers['x-user-agent']) {
            headers['x-user-agent'] = 'Node.twitter-api-v2';
        }
        // Add protocol to URL if needed
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        // Convert URL to object that will receive all URL modifications
        const urlObject = new URL(url);
        // URL without query string to save as endpoint name
        const rawUrl = urlObject.origin + urlObject.pathname;
        // Apply URL parameters
        if (params) {
            request_param_helper_1.default.applyRequestParametersToUrl(urlObject, params);
        }
        // Build an URL without anything in QS, and QSP in query
        const query = request_param_helper_1.default.formatQueryToString(rawQuery);
        request_param_helper_1.default.moveUrlQueryParamsIntoObject(urlObject, query);
        // Delete undefined parameters
        if (!(rawBody instanceof Buffer)) {
            helpers_1.trimUndefinedProperties(rawBody);
        }
        // OAuth signature should not include parameters when using multipart.
        const bodyType = forceBodyMode !== null && forceBodyMode !== void 0 ? forceBodyMode : request_param_helper_1.default.autoDetectBodyType(urlObject);
        // If undefined or true, enable auth by headers
        if (enableAuth !== false) {
            // OAuth needs body signature only if body is URL encoded.
            const bodyInSignature = ClientRequestMaker.BODY_METHODS.has(method) && bodyType === 'url';
            headers = this.writeAuthHeaders({ headers, bodyInSignature, method, query, url: urlObject, body: rawBody });
        }
        if (ClientRequestMaker.BODY_METHODS.has(method)) {
            body = request_param_helper_1.default.constructBodyParams(rawBody, headers, bodyType) || undefined;
        }
        request_param_helper_1.default.addQueryParamsToUrl(urlObject, query);
        return {
            rawUrl,
            url: urlObject,
            method,
            headers,
            body,
        };
    }
}
exports.ClientRequestMaker = ClientRequestMaker;
ClientRequestMaker.BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);


/***/ }),

/***/ 7954:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestParamHelpers = void 0;
const form_data_helper_1 = __nccwpck_require__(8274);
/* Helpers functions that are specific to this class but do not depends on instance */
class RequestParamHelpers {
    static formatQueryToString(query) {
        const formattedQuery = {};
        for (const prop in query) {
            if (typeof query[prop] === 'string') {
                formattedQuery[prop] = query[prop];
            }
            else if (typeof query[prop] !== 'undefined') {
                formattedQuery[prop] = String(query[prop]);
            }
        }
        return formattedQuery;
    }
    static autoDetectBodyType(url) {
        if (url.pathname.startsWith('/2/') || url.pathname.startsWith('/labs/2/')) {
            // oauth2 takes url encoded
            if (url.password.startsWith('/2/oauth2')) {
                return 'url';
            }
            // Twitter API v2 has JSON-encoded requests for everything else
            return 'json';
        }
        if (url.hostname === 'upload.twitter.com') {
            if (url.pathname === '/1.1/media/upload.json') {
                return 'form-data';
            }
            // json except for media/upload command, that is form-data.
            return 'json';
        }
        const endpoint = url.pathname.split('/1.1/', 2)[1];
        if (this.JSON_1_1_ENDPOINTS.has(endpoint)) {
            return 'json';
        }
        return 'url';
    }
    static addQueryParamsToUrl(url, query) {
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.append(key, value);
        }
        if (url.search) {
            // URLSearchParams doesnt encode '*', but Twitter wants it encoded.
            url.search = url.search.replace(/\*/g, '%2A');
        }
    }
    static constructBodyParams(body, headers, mode) {
        if (body instanceof Buffer) {
            return body;
        }
        if (mode === 'json') {
            headers['content-type'] = 'application/json;charset=UTF-8';
            return JSON.stringify(body);
        }
        else if (mode === 'url') {
            headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            if (Object.keys(body).length) {
                return new URLSearchParams(body)
                    .toString()
                    .replace(/\*/g, '%2A'); // URLSearchParams doesnt encode '*', but Twitter wants it encoded.
            }
            return '';
        }
        else if (mode === 'raw') {
            throw new Error('You can only use raw body mode with Buffers. To give a string, use Buffer.from(str).');
        }
        else {
            const form = new form_data_helper_1.FormDataHelper();
            for (const parameter in body) {
                form.append(parameter, body[parameter]);
            }
            const formHeaders = form.getHeaders();
            headers['content-type'] = formHeaders['content-type'];
            return form.getBuffer();
        }
    }
    static setBodyLengthHeader(options, body) {
        var _a;
        options.headers = (_a = options.headers) !== null && _a !== void 0 ? _a : {};
        if (typeof body === 'string') {
            options.headers['content-length'] = Buffer.byteLength(body);
        }
        else {
            options.headers['content-length'] = body.length;
        }
    }
    static isOAuthSerializable(item) {
        return !(item instanceof Buffer);
    }
    static mergeQueryAndBodyForOAuth(query, body) {
        const parameters = {};
        for (const prop in query) {
            parameters[prop] = query[prop];
        }
        if (this.isOAuthSerializable(body)) {
            for (const prop in body) {
                const bodyProp = body[prop];
                if (this.isOAuthSerializable(bodyProp)) {
                    parameters[prop] = typeof bodyProp === 'object' && bodyProp !== null && 'toString' in bodyProp
                        ? bodyProp.toString()
                        : bodyProp;
                }
            }
        }
        return parameters;
    }
    static moveUrlQueryParamsIntoObject(url, query) {
        for (const [param, value] of url.searchParams) {
            query[param] = value;
        }
        // Remove the query string
        url.search = '';
        return url;
    }
    /**
     * Replace URL parameters available in pathname, like `:id`, with data given in `parameters`:
     * `https://twitter.com/:id.json` + `{ id: '20' }` => `https://twitter.com/20.json`
     */
    static applyRequestParametersToUrl(url, parameters) {
        url.pathname = url.pathname.replace(/:([A-Z_-]+)/ig, (fullMatch, paramName) => {
            if (parameters[paramName] !== undefined) {
                return String(parameters[paramName]);
            }
            return fullMatch;
        });
        return url;
    }
}
exports.RequestParamHelpers = RequestParamHelpers;
RequestParamHelpers.JSON_1_1_ENDPOINTS = new Set([
    'direct_messages/events/new.json',
    'direct_messages/welcome_messages/new.json',
    'direct_messages/welcome_messages/rules/new.json',
    'media/metadata/create.json',
    'collections/entries/curate.json',
]);
exports.default = RequestParamHelpers;


/***/ }),

/***/ 8726:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const request_maker_mixin_1 = __nccwpck_require__(6131);
/**
 * Base class for Twitter instances
 */
class TwitterApiBase extends request_maker_mixin_1.ClientRequestMaker {
    constructor(token) {
        super();
        this._currentUser = null;
        if (typeof token === 'string') {
            this._bearerToken = token;
        }
        else if (token instanceof TwitterApiBase) {
            this._accessToken = token._accessToken;
            this._accessSecret = token._accessSecret;
            this._consumerToken = token._consumerToken;
            this._consumerSecret = token._consumerSecret;
            this._oauth = token._oauth;
            this._prefix = token._prefix;
            this._bearerToken = token._bearerToken;
            this._basicToken = token._basicToken;
            this._clientId = token._clientId;
            this._rateLimits = token._rateLimits;
        }
        else if (typeof token === 'object' && 'appKey' in token) {
            this._consumerToken = token.appKey;
            this._consumerSecret = token.appSecret;
            if (token.accessToken && token.accessSecret) {
                this._accessToken = token.accessToken;
                this._accessSecret = token.accessSecret;
            }
            this._oauth = this.buildOAuth();
        }
        else if (typeof token === 'object' && 'username' in token) {
            const key = encodeURIComponent(token.username) + ':' + encodeURIComponent(token.password);
            this._basicToken = Buffer.from(key).toString('base64');
        }
        else if (typeof token === 'object' && 'clientId' in token) {
            this._clientId = token.clientId;
        }
    }
    /* Prefix/Token handling */
    setPrefix(prefix) {
        this._prefix = prefix;
    }
    cloneWithPrefix(prefix) {
        const clone = this.constructor(this);
        clone.setPrefix(prefix);
        return clone;
    }
    getActiveTokens() {
        if (this._bearerToken) {
            return {
                type: 'oauth2',
                bearerToken: this._bearerToken,
            };
        }
        else if (this._basicToken) {
            return {
                type: 'basic',
                token: this._basicToken,
            };
        }
        else if (this._consumerSecret && this._oauth) {
            return {
                type: 'oauth-1.0a',
                appKey: this._consumerToken,
                appSecret: this._consumerSecret,
                accessToken: this._accessToken,
                accessSecret: this._accessSecret,
            };
        }
        return { type: 'none' };
    }
    /* Rate limit cache */
    /**
     * Tells if you hit the Twitter rate limit for {endpoint}.
     * (local data only, this should not ask anything to Twitter)
     */
    hasHitRateLimit(endpoint) {
        var _a;
        if (this.isRateLimitStatusObsolete(endpoint)) {
            return false;
        }
        return ((_a = this.getLastRateLimitStatus(endpoint)) === null || _a === void 0 ? void 0 : _a.remaining) === 0;
    }
    /**
     * Tells if you hit the returned Twitter rate limit for {endpoint} has expired.
     * If client has no saved rate limit data for {endpoint}, this will gives you `true`.
     */
    isRateLimitStatusObsolete(endpoint) {
        const rateLimit = this.getLastRateLimitStatus(endpoint);
        if (rateLimit === undefined) {
            return true;
        }
        // Timestamps are exprimed in seconds, JS works with ms
        return (rateLimit.reset * 1000) < Date.now();
    }
    /**
     * Get the last obtained Twitter rate limit information for {endpoint}.
     * (local data only, this should not ask anything to Twitter)
     */
    getLastRateLimitStatus(endpoint) {
        const endpointWithPrefix = endpoint.match(/^https?:\/\//) ? endpoint : (this._prefix + endpoint);
        return this._rateLimits[endpointWithPrefix];
    }
    /* Current user cache */
    /** Get cached current user. */
    async getCurrentUserObject(forceFetch = false) {
        if (!forceFetch && this._currentUser) {
            return this._currentUser;
        }
        const currentUser = await this.get('account/verify_credentials.json', { tweet_mode: 'extended' }, { prefix: 'https://api.twitter.com/1.1/' });
        this._currentUser = currentUser;
        return currentUser;
    }
    async get(url, query = {}, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'GET',
            query,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async delete(url, query = {}, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'DELETE',
            query,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async post(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'POST',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async put(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'PUT',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async patch(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'PATCH',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    getStream(url, query, { prefix = this._prefix, ...rest } = {}) {
        return this.sendStream({
            url: prefix ? prefix + url : url,
            method: 'GET',
            query,
            ...rest,
        });
    }
    postStream(url, body, { prefix = this._prefix, ...rest } = {}) {
        return this.sendStream({
            url: prefix ? prefix + url : url,
            method: 'POST',
            body,
            ...rest,
        });
    }
}
exports.default = TwitterApiBase;


/***/ }),

/***/ 3810:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_base_1 = __importDefault(__nccwpck_require__(8726));
/**
 * Base subclient for every v1 and v2 client.
 */
class TwitterApiSubClient extends client_base_1.default {
    constructor(instance) {
        super();
        if (!(instance instanceof client_base_1.default)) {
            throw new Error('You must instance TwitterApiv1 instance from existing TwitterApi instance.');
        }
        const inst = instance;
        this._bearerToken = inst._bearerToken;
        this._consumerToken = inst._consumerToken;
        this._consumerSecret = inst._consumerSecret;
        this._accessToken = inst._accessToken;
        this._accessSecret = inst._accessSecret;
        this._basicToken = inst._basicToken;
        this._oauth = inst._oauth;
        this._clientId = inst._clientId;
        this._rateLimits = inst._rateLimits;
    }
}
exports.default = TwitterApiSubClient;


/***/ }),

/***/ 6118:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwitterApiReadOnly = exports.TwitterApiReadWrite = exports.TwitterApi = void 0;
const client_v1_1 = __importDefault(__nccwpck_require__(7030));
const client_v2_1 = __importDefault(__nccwpck_require__(4692));
const readwrite_1 = __importDefault(__nccwpck_require__(489));
// "Real" exported client for usage of TwitterApi.
/**
 * Twitter v1.1 and v2 API client.
 */
class TwitterApi extends readwrite_1.default {
    /* Direct access to subclients */
    get v1() {
        if (this._v1)
            return this._v1;
        return this._v1 = new client_v1_1.default(this);
    }
    get v2() {
        if (this._v2)
            return this._v2;
        return this._v2 = new client_v2_1.default(this);
    }
    /**
     * Get a client with read/write rights.
     */
    get readWrite() {
        return this;
    }
    /* Static helpers */
    static getErrors(error) {
        var _a;
        if (typeof error !== 'object')
            return [];
        if (!('data' in error))
            return [];
        return (_a = error.data.errors) !== null && _a !== void 0 ? _a : [];
    }
    /** Extract another image size than obtained in a `profile_image_url` or `profile_image_url_https` field of a user object. */
    static getProfileImageInSize(profileImageUrl, size) {
        const lastPart = profileImageUrl.split('/').pop();
        const sizes = ['normal', 'bigger', 'mini'];
        let originalUrl = profileImageUrl;
        for (const availableSize of sizes) {
            if (lastPart.includes(`_${availableSize}`)) {
                originalUrl = profileImageUrl.replace(`_${availableSize}`, '');
                break;
            }
        }
        if (size === 'original') {
            return originalUrl;
        }
        const extPos = originalUrl.lastIndexOf('.');
        if (extPos !== -1) {
            const ext = originalUrl.slice(extPos + 1);
            return originalUrl.slice(0, extPos) + '_' + size + '.' + ext;
        }
        else {
            return originalUrl + '_' + size;
        }
    }
}
exports.TwitterApi = TwitterApi;
var readwrite_2 = __nccwpck_require__(489);
Object.defineProperty(exports, "TwitterApiReadWrite", ({ enumerable: true, get: function () { return __importDefault(readwrite_2).default; } }));
var readonly_1 = __nccwpck_require__(7344);
Object.defineProperty(exports, "TwitterApiReadOnly", ({ enumerable: true, get: function () { return __importDefault(readonly_1).default; } }));
exports.default = TwitterApi;


/***/ }),

/***/ 7344:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const _1 = __importDefault(__nccwpck_require__(6118));
const client_base_1 = __importDefault(__nccwpck_require__(8726));
const client_v1_read_1 = __importDefault(__nccwpck_require__(4273));
const client_v2_read_1 = __importDefault(__nccwpck_require__(7318));
const oauth2_helper_1 = __nccwpck_require__(9791);
/**
 * Twitter v1.1 and v2 API client.
 */
class TwitterApiReadOnly extends client_base_1.default {
    /* Direct access to subclients */
    get v1() {
        if (this._v1)
            return this._v1;
        return this._v1 = new client_v1_read_1.default(this);
    }
    get v2() {
        if (this._v2)
            return this._v2;
        return this._v2 = new client_v2_read_1.default(this);
    }
    /**
     * Fetch and cache current user.
     * This method can only be called with a OAuth 1.0a user authentification.
     *
     * You can use this method to test if authentification was successful.
     * Next calls to this methods will use the cached user, unless `forceFetch: true` is given.
     */
    async currentUser(forceFetch = false) {
        return await this.getCurrentUserObject(forceFetch);
    }
    /* Shortcuts to endpoints */
    search(what, options) {
        return this.v2.search(what, options);
    }
    /* Authentification */
    /**
     * Generate the OAuth request token link for user-based OAuth 1.0 auth.
     *
     * ```ts
     * // Instanciate TwitterApi with consumer keys
     * const client = new TwitterApi({ appKey: 'consumer_key', appSecret: 'consumer_secret' });
     *
     * const tokenRequest = await client.generateAuthLink('oob-or-your-callback-url');
     * // redirect end-user to tokenRequest.url
     *
     * // Save tokenRequest.oauth_token_secret somewhere, it will be needed for next auth step.
     * ```
     */
    async generateAuthLink(oauth_callback = 'oob', { authAccessType, linkMode = 'authenticate', forceLogin, screenName, } = {}) {
        const oauthResult = await this.post('https://api.twitter.com/oauth/request_token', { oauth_callback, x_auth_access_type: authAccessType });
        let url = `https://api.twitter.com/oauth/${linkMode}?oauth_token=${encodeURIComponent(oauthResult.oauth_token)}`;
        if (forceLogin !== undefined) {
            url += `&force_login=${encodeURIComponent(forceLogin)}`;
        }
        if (screenName !== undefined) {
            url += `&screen_name=${encodeURIComponent(screenName)}`;
        }
        return {
            url,
            ...oauthResult,
        };
    }
    /**
     * Obtain access to user-based OAuth 1.0 auth.
     *
     * After user is redirect from your callback, use obtained oauth_token and oauth_verifier to
     * instanciate the new TwitterApi instance.
     *
     * ```ts
     * // Use the saved oauth_token_secret associated to oauth_token returned by callback
     * const requestClient = new TwitterApi({
     *  appKey: 'consumer_key',
     *  appSecret: 'consumer_secret',
     *  accessToken: 'oauth_token',
     *  accessSecret: 'oauth_token_secret'
     * });
     *
     * // Use oauth_verifier obtained from callback request
     * const { client: userClient } = await requestClient.login('oauth_verifier');
     *
     * // {userClient} is a valid {TwitterApi} object you can use for future requests
     * ```
     */
    async login(oauth_verifier) {
        const oauth_result = await this.post('https://api.twitter.com/oauth/access_token', { oauth_token: this._accessToken, oauth_verifier });
        const client = new _1.default({
            appKey: this._consumerToken,
            appSecret: this._consumerSecret,
            accessToken: oauth_result.oauth_token,
            accessSecret: oauth_result.oauth_token_secret,
        });
        return {
            accessToken: oauth_result.oauth_token,
            accessSecret: oauth_result.oauth_token_secret,
            userId: oauth_result.user_id,
            screenName: oauth_result.screen_name,
            client,
        };
    }
    /**
     * Enable application-only authentification.
     *
     * To make the request, instanciate TwitterApi with consumer and secret.
     *
     * ```ts
     * const requestClient = new TwitterApi({ appKey: 'consumer', appSecret: 'secret' });
     * const appClient = await requestClient.appLogin();
     *
     * // Use {appClient} to make requests
     * ```
     */
    async appLogin() {
        if (!this._consumerToken || !this._consumerSecret)
            throw new Error('You must setup TwitterApi instance with consumers to enable app-only login');
        // Create a client with Basic authentification
        const basicClient = new _1.default({ username: this._consumerToken, password: this._consumerSecret });
        const res = await basicClient.post('https://api.twitter.com/oauth2/token', { grant_type: 'client_credentials' });
        // New object with Bearer token
        return new _1.default(res.access_token);
    }
    /* OAuth 2 user authentification */
    /**
     * Generate the OAuth request token link for user-based OAuth 2.0 auth.
     *
     * ```ts
     * // Instanciate TwitterApi with client ID
     * const client = new TwitterApi({ clientId: 'yourClientId' });
     *
     * // Generate a link to callback URL that will gives a token with tweet+user read access
     * const link = client.generateOAuth2AuthLink('your-callback-url', { scope: ['tweet.read', 'users.read'] });
     *
     * // Extract props from generate link
     * const { url, state, codeVerifier } = link;
     *
     * // redirect end-user to url
     * // Save `state` and `codeVerifier` somewhere, it will be needed for next auth step.
     * ```
     */
    generateOAuth2AuthLink(redirectUri, options = {}) {
        var _a, _b;
        if (!this._clientId) {
            throw new Error('Twitter API instance is not initialized with client ID. ' +
                'Please build an instance with: new TwitterApi({ clientId: \'<yourClientId>\' })');
        }
        const state = (_a = options.state) !== null && _a !== void 0 ? _a : oauth2_helper_1.OAuth2Helper.generateRandomString(32);
        const codeVerifier = oauth2_helper_1.OAuth2Helper.getCodeVerifier();
        const codeChallenge = oauth2_helper_1.OAuth2Helper.getCodeChallengeFromVerifier(codeVerifier);
        const rawScope = (_b = options.scope) !== null && _b !== void 0 ? _b : '';
        const scope = Array.isArray(rawScope) ? rawScope.join(' ') : rawScope;
        const url = new URL('https://twitter.com/i/oauth2/authorize');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this._clientId);
        url.searchParams.set('redirect_uri', redirectUri);
        url.searchParams.set('state', state);
        url.searchParams.set('code_challenge', codeChallenge);
        url.searchParams.set('code_challenge_method', 's256');
        url.searchParams.set('scope', scope);
        return {
            url: url.toString(),
            state,
            codeVerifier,
            codeChallenge,
        };
    }
    /**
     * Obtain access to user-based OAuth 2.0 auth.
     *
     * After user is redirect from your callback, use obtained code to
     * instanciate the new TwitterApi instance.
     *
     * ```ts
     * // Use the saved codeVerifier associated to state (present in query string of callback)
     * const requestClient = new TwitterApi({ clientId: 'yourClientId' });
     *
     * const { client: userClient, refreshToken } = await requestClient.loginWithOAuth2({
     *  code: 'codeFromQueryString',
     *  // the same URL given to generateOAuth2AuthLink
     *  redirectUri,
     *  // the verifier returned by generateOAuth2AuthLink
     *  codeVerifier,
     * });
     *
     * // {userClient} is a valid {TwitterApi} object you can use for future requests
     * // {refreshToken} is defined if 'offline.access' is in scope.
     * ```
     */
    async loginWithOAuth2({ code, codeVerifier, redirectUri }) {
        if (!this._clientId) {
            throw new Error('Twitter API instance is not initialized with client ID. ' +
                'Please build an instance with: new TwitterApi({ clientId: \'<yourClientId>\' })');
        }
        const accessTokenResult = await this.post('https://api.twitter.com/2/oauth2/token', {
            code,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            client_id: this._clientId,
        });
        return this.parseOAuth2AccessTokenResult(accessTokenResult);
    }
    /**
     * Obtain a new access token to user-based OAuth 2.0 auth from a refresh token.
     *
     * ```ts
     * const requestClient = new TwitterApi({ clientId: 'yourClientId' });
     *
     * const { client: userClient } = await requestClient.refreshOAuth2Token('refreshToken');
     * // {userClient} is a valid {TwitterApi} object you can use for future requests
     * ```
     */
    async refreshOAuth2Token(refreshToken) {
        if (!this._clientId) {
            throw new Error('Twitter API instance is not initialized with client ID. ' +
                'Please build an instance with: new TwitterApi({ clientId: \'<yourClientId>\' })');
        }
        const accessTokenResult = await this.post('https://api.twitter.com/2/oauth2/token', {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: this._clientId,
        });
        return this.parseOAuth2AccessTokenResult(accessTokenResult);
    }
    /**
     * Revoke a single user-based OAuth 2.0 token.
     *
     * You must specify its source, access token (directly after login)
     * or refresh token (if you've called `.refreshOAuth2Token` before).
     */
    async revokeOAuth2Token(token, tokenType = 'access_token') {
        if (!this._clientId) {
            throw new Error('Twitter API instance is not initialized with client ID. ' +
                'Please build an instance with: new TwitterApi({ clientId: \'<yourClientId>\' })');
        }
        return await this.post('https://api.twitter.com/2/oauth2/revoke', {
            client_id: this._clientId,
            token,
            token_type_hint: tokenType,
        });
    }
    parseOAuth2AccessTokenResult(result) {
        const client = new _1.default(result.access_token);
        const scope = result.scope.split(' ').filter(e => e);
        return {
            client,
            expiresIn: result.expires_in,
            accessToken: result.access_token,
            scope,
            refreshToken: result.refresh_token,
        };
    }
}
exports.default = TwitterApiReadOnly;


/***/ }),

/***/ 489:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_v1_write_1 = __importDefault(__nccwpck_require__(6685));
const client_v2_write_1 = __importDefault(__nccwpck_require__(5587));
const readonly_1 = __importDefault(__nccwpck_require__(7344));
/**
 * Twitter v1.1 and v2 API client.
 */
class TwitterApiReadWrite extends readonly_1.default {
    /* Direct access to subclients */
    get v1() {
        if (this._v1)
            return this._v1;
        return this._v1 = new client_v1_write_1.default(this);
    }
    get v2() {
        if (this._v2)
            return this._v2;
        return this._v2 = new client_v2_write_1.default(this);
    }
    /**
     * Get a client with read only rights.
     */
    get readOnly() {
        return this;
    }
}
exports.default = TwitterApiReadWrite;


/***/ }),

/***/ 3444:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.API_V1_1_STREAM_PREFIX = exports.API_V1_1_UPLOAD_PREFIX = exports.API_V1_1_PREFIX = exports.API_V2_LABS_PREFIX = exports.API_V2_PREFIX = void 0;
exports.API_V2_PREFIX = 'https://api.twitter.com/2/';
exports.API_V2_LABS_PREFIX = 'https://api.twitter.com/labs/2/';
exports.API_V1_1_PREFIX = 'https://api.twitter.com/1.1/';
exports.API_V1_1_UPLOAD_PREFIX = 'https://upload.twitter.com/1.1/';
exports.API_V1_1_STREAM_PREFIX = 'https://stream.twitter.com/1.1/';


/***/ }),

/***/ 1120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeDeprecationWarning = exports.hasMultipleItems = exports.isTweetStreamV2ErrorPayload = exports.trimUndefinedProperties = exports.arrayWrap = void 0;
const settings_1 = __nccwpck_require__(6273);
function arrayWrap(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
exports.arrayWrap = arrayWrap;
function trimUndefinedProperties(object) {
    // Delete undefined parameters
    for (const parameter in object) {
        if (object[parameter] === undefined)
            delete object[parameter];
    }
}
exports.trimUndefinedProperties = trimUndefinedProperties;
function isTweetStreamV2ErrorPayload(payload) {
    // Is error only if 'errors' is present and 'data' does not exists
    return typeof payload === 'object'
        && 'errors' in payload
        && !('data' in payload);
}
exports.isTweetStreamV2ErrorPayload = isTweetStreamV2ErrorPayload;
function hasMultipleItems(item) {
    if (Array.isArray(item) && item.length > 1) {
        return true;
    }
    return item.toString().includes(',');
}
exports.hasMultipleItems = hasMultipleItems;
const deprecationWarningsCache = new Set();
function safeDeprecationWarning(message) {
    if (typeof console === 'undefined' || !console.warn || !settings_1.TwitterApiV2Settings.deprecationWarnings) {
        return;
    }
    const hash = `${message.instance}-${message.method}-${message.problem}`;
    if (deprecationWarningsCache.has(hash)) {
        return;
    }
    const formattedMsg = `[twitter-api-v2] Deprecation warning: In ${message.instance}.${message.method}() call` +
        `, ${message.problem}.\n${message.resolution}.`;
    console.warn(formattedMsg);
    console.warn('To disable this message, import TwitterApiV2Settings from twitter-api-v2 and set TwitterApiV2Settings.deprecationWarnings to false.');
    deprecationWarningsCache.add(hash);
}
exports.safeDeprecationWarning = safeDeprecationWarning;


/***/ }),

/***/ 9360:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var client_1 = __nccwpck_require__(6118);
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(client_1).default; } }));
__exportStar(__nccwpck_require__(6118), exports);
__exportStar(__nccwpck_require__(7030), exports);
__exportStar(__nccwpck_require__(4692), exports);
__exportStar(__nccwpck_require__(1204), exports);
__exportStar(__nccwpck_require__(1638), exports);
__exportStar(__nccwpck_require__(5814), exports);
__exportStar(__nccwpck_require__(9362), exports);
__exportStar(__nccwpck_require__(6273), exports);


/***/ }),

/***/ 5317:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviousableTwitterPaginator = exports.TwitterPaginator = void 0;
/** TwitterPaginator: able to get consume data from initial request, then fetch next data sequentially. */
class TwitterPaginator {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor({ realData, rateLimit, instance, queryParams, sharedParams }) {
        this._maxResultsWhenFetchLast = 100;
        this._realData = realData;
        this._rateLimit = rateLimit;
        this._instance = instance;
        this._queryParams = queryParams;
        this._sharedParams = sharedParams;
    }
    get _isRateLimitOk() {
        const resetDate = this._rateLimit.reset * 1000;
        if (resetDate < Date.now()) {
            return true;
        }
        return this._rateLimit.remaining > 0;
    }
    makeRequest(queryParams) {
        return this._instance.get(this.getEndpoint(), queryParams, { fullResponse: true, params: this._sharedParams });
    }
    makeNewInstanceFromResult(result, queryParams) {
        // Construct a subclass
        return new this.constructor({
            realData: result.data,
            rateLimit: result.rateLimit,
            instance: this._instance,
            queryParams,
            sharedParams: this._sharedParams,
        });
    }
    getEndpoint() {
        return this._endpoint;
    }
    injectQueryParams(maxResults) {
        return {
            ...(maxResults ? { max_results: maxResults } : {}),
            ...this._queryParams,
        };
    }
    /* ---------------------- */
    /* Real paginator methods */
    /* ---------------------- */
    /**
     * Next page.
     */
    async next(maxResults) {
        const queryParams = this.getNextQueryParams(maxResults);
        const result = await this.makeRequest(queryParams);
        return this.makeNewInstanceFromResult(result, queryParams);
    }
    /**
     * Next page, but store it in current instance.
     */
    async fetchNext(maxResults) {
        const queryParams = this.getNextQueryParams(maxResults);
        const result = await this.makeRequest(queryParams);
        // Await in case of async sub-methods
        await this.refreshInstanceFromResult(result, true);
        return this;
    }
    /**
     * Fetch up to {count} items after current page,
     * as long as rate limit is not hit and Twitter has some results
     */
    async fetchLast(count = Infinity) {
        let queryParams = this.getNextQueryParams(this._maxResultsWhenFetchLast);
        let resultCount = 0;
        // Break at rate limit limit
        while (resultCount < count && this._isRateLimitOk) {
            const response = await this.makeRequest(queryParams);
            await this.refreshInstanceFromResult(response, true);
            resultCount += this.getPageLengthFromRequest(response);
            if (this.isFetchLastOver(response)) {
                break;
            }
            queryParams = this.getNextQueryParams(this._maxResultsWhenFetchLast);
        }
        return this;
    }
    get rateLimit() {
        return { ...this._rateLimit };
    }
    /** Get raw data returned by Twitter API. */
    get data() {
        return this._realData;
    }
    /**
     * Iterate over currently fetched items.
     */
    *[Symbol.iterator]() {
        yield* this.getItemArray();
    }
    /**
     * Iterate over items "undefinitely" (until rate limit is hit / they're no more tweets available)
     */
    async *[Symbol.asyncIterator]() {
        yield* this.getItemArray();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let paginator = this;
        while (this._isRateLimitOk && paginator.getItemArray().length > 0) {
            const next = await paginator.next(this._maxResultsWhenFetchLast);
            this._rateLimit = next._rateLimit;
            const items = next.getItemArray();
            yield* items;
            paginator = next;
        }
    }
}
exports.TwitterPaginator = TwitterPaginator;
/** PreviousableTwitterPaginator: a TwitterPaginator able to get consume data from both side, next and previous. */
class PreviousableTwitterPaginator extends TwitterPaginator {
    /**
     * Previous page (new tweets)
     */
    async previous(maxResults) {
        const queryParams = this.getPreviousQueryParams(maxResults);
        const result = await this.makeRequest(queryParams);
        return this.makeNewInstanceFromResult(result, queryParams);
    }
    /**
     * Previous page, but in current instance.
     */
    async fetchPrevious(maxResults) {
        const queryParams = this.getPreviousQueryParams(maxResults);
        const result = await this.makeRequest(queryParams);
        await this.refreshInstanceFromResult(result, false);
        return this;
    }
}
exports.PreviousableTwitterPaginator = PreviousableTwitterPaginator;
exports.default = TwitterPaginator;


/***/ }),

/***/ 823:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WelcomeDmV1Paginator = exports.DmEventsV1Paginator = void 0;
const paginator_v1_1 = __nccwpck_require__(593);
class DmEventsV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'direct_messages/events/list.json';
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.events.push(...result.events);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.events.length;
    }
    getItemArray() {
        return this.events;
    }
    /**
     * Events returned by paginator.
     */
    get events() {
        return this._realData.events;
    }
}
exports.DmEventsV1Paginator = DmEventsV1Paginator;
class WelcomeDmV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'direct_messages/welcome_messages/list.json';
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.welcome_messages.push(...result.welcome_messages);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.welcome_messages.length;
    }
    getItemArray() {
        return this.welcomeMessages;
    }
    get welcomeMessages() {
        return this._realData.welcome_messages;
    }
}
exports.WelcomeDmV1Paginator = WelcomeDmV1Paginator;


/***/ }),

/***/ 5814:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(6301), exports);
__exportStar(__nccwpck_require__(5317), exports);
__exportStar(__nccwpck_require__(823), exports);
__exportStar(__nccwpck_require__(7277), exports);
__exportStar(__nccwpck_require__(9848), exports);
__exportStar(__nccwpck_require__(8985), exports);
__exportStar(__nccwpck_require__(2178), exports);
__exportStar(__nccwpck_require__(5631), exports);


/***/ }),

/***/ 5631:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListSubscribersV1Paginator = exports.ListMembersV1Paginator = exports.ListSubscriptionsV1Paginator = exports.ListOwnershipsV1Paginator = exports.ListMembershipsV1Paginator = void 0;
const paginator_v1_1 = __nccwpck_require__(593);
class ListListsV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.lists.push(...result.lists);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.lists.length;
    }
    getItemArray() {
        return this.lists;
    }
    /**
     * Lists returned by paginator.
     */
    get lists() {
        return this._realData.lists;
    }
}
class ListMembershipsV1Paginator extends ListListsV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/memberships.json';
    }
}
exports.ListMembershipsV1Paginator = ListMembershipsV1Paginator;
class ListOwnershipsV1Paginator extends ListListsV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/ownerships.json';
    }
}
exports.ListOwnershipsV1Paginator = ListOwnershipsV1Paginator;
class ListSubscriptionsV1Paginator extends ListListsV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/subscriptions.json';
    }
}
exports.ListSubscriptionsV1Paginator = ListSubscriptionsV1Paginator;
class ListUsersV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.users.push(...result.users);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.users.length;
    }
    getItemArray() {
        return this.users;
    }
    /**
     * Users returned by paginator.
     */
    get users() {
        return this._realData.users;
    }
}
class ListMembersV1Paginator extends ListUsersV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/members.json';
    }
}
exports.ListMembersV1Paginator = ListMembersV1Paginator;
class ListSubscribersV1Paginator extends ListUsersV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/subscribers.json';
    }
}
exports.ListSubscribersV1Paginator = ListSubscribersV1Paginator;


/***/ }),

/***/ 7277:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MuteUserIdsV1Paginator = exports.MuteUserListV1Paginator = void 0;
const paginator_v1_1 = __nccwpck_require__(593);
class MuteUserListV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'mutes/users/list.json';
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.users.push(...result.users);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.users.length;
    }
    getItemArray() {
        return this.users;
    }
    /**
     * Users returned by paginator.
     */
    get users() {
        return this._realData.users;
    }
}
exports.MuteUserListV1Paginator = MuteUserListV1Paginator;
class MuteUserIdsV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'mutes/users/ids.json';
        this._maxResultsWhenFetchLast = 5000;
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.ids.push(...result.ids);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.ids.length;
    }
    getItemArray() {
        return this.ids;
    }
    /**
     * Users IDs returned by paginator.
     */
    get ids() {
        return this._realData.ids;
    }
}
exports.MuteUserIdsV1Paginator = MuteUserIdsV1Paginator;


/***/ }),

/***/ 593:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CursoredV1Paginator = void 0;
const TwitterPaginator_1 = __importDefault(__nccwpck_require__(5317));
class CursoredV1Paginator extends TwitterPaginator_1.default {
    getNextQueryParams(maxResults) {
        var _a;
        return {
            ...this._queryParams,
            cursor: (_a = this._realData.next_cursor_str) !== null && _a !== void 0 ? _a : this._realData.next_cursor,
            ...(maxResults ? { count: maxResults } : {}),
        };
    }
    isFetchLastOver(result) {
        return this.isNextCursorInvalid(result.data.next_cursor) && this.isNextCursorInvalid(result.data.next_cursor_str);
    }
    isNextCursorInvalid(value) {
        return value === undefined
            || value === 0
            || value === -1
            || value === '0'
            || value === '-1';
    }
}
exports.CursoredV1Paginator = CursoredV1Paginator;


/***/ }),

/***/ 9848:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListTimelineV1Paginator = exports.UserTimelineV1Paginator = exports.MentionTimelineV1Paginator = exports.HomeTimelineV1Paginator = void 0;
const TwitterPaginator_1 = __importDefault(__nccwpck_require__(5317));
/** A generic TwitterPaginator able to consume TweetV1 timelines. */
class TweetTimelineV1Paginator extends TwitterPaginator_1.default {
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.push(...result);
        }
    }
    getNextQueryParams(maxResults) {
        const lastestId = BigInt(this._realData[this._realData.length - 1].id_str);
        return {
            ...this.injectQueryParams(maxResults),
            max_id: (lastestId - BigInt(1)).toString(),
        };
    }
    getPageLengthFromRequest(result) {
        return result.data.length;
    }
    isFetchLastOver(result) {
        return !result.data.length;
    }
    getItemArray() {
        return this.tweets;
    }
    /**
     * Tweets returned by paginator.
     */
    get tweets() {
        return this._realData;
    }
}
// Timelines
// Home
class HomeTimelineV1Paginator extends TweetTimelineV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'statuses/home_timeline.json';
    }
}
exports.HomeTimelineV1Paginator = HomeTimelineV1Paginator;
// Mention
class MentionTimelineV1Paginator extends TweetTimelineV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'statuses/mentions_timeline.json';
    }
}
exports.MentionTimelineV1Paginator = MentionTimelineV1Paginator;
// User
class UserTimelineV1Paginator extends TweetTimelineV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'statuses/user_timeline.json';
    }
}
exports.UserTimelineV1Paginator = UserTimelineV1Paginator;
// Lists
class ListTimelineV1Paginator extends TweetTimelineV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'lists/statuses.json';
    }
}
exports.ListTimelineV1Paginator = ListTimelineV1Paginator;


/***/ }),

/***/ 6301:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TweetV2UserLikedTweetsPaginator = exports.TweetUserMentionTimelineV2Paginator = exports.TweetUserTimelineV2Paginator = exports.TweetSearchAllV2Paginator = exports.TweetSearchRecentV2Paginator = void 0;
const TwitterPaginator_1 = __nccwpck_require__(5317);
/** A generic PreviousableTwitterPaginator able to consume TweetV2[]. */
class TweetsV2Paginator extends TwitterPaginator_1.PreviousableTwitterPaginator {
    updateIncludes(data) {
        if (!data.includes) {
            return;
        }
        if (!this._realData.includes) {
            this._realData.includes = {};
        }
        const includesRealData = this._realData.includes;
        for (const [includeKey, includeArray] of Object.entries(data.includes)) {
            if (!includesRealData[includeKey]) {
                includesRealData[includeKey] = [];
            }
            includesRealData[includeKey] = [
                ...includesRealData[includeKey],
                ...includeArray,
            ];
        }
    }
    getPageLengthFromRequest(result) {
        var _a, _b;
        return (_b = (_a = result.data.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    isFetchLastOver(result) {
        var _a;
        return !((_a = result.data.data) === null || _a === void 0 ? void 0 : _a.length) || !result.data.meta.next_token;
    }
    getItemArray() {
        return this.tweets;
    }
    /**
     * Tweets returned by paginator.
     */
    get tweets() {
        var _a;
        return (_a = this._realData.data) !== null && _a !== void 0 ? _a : [];
    }
    get meta() {
        return this._realData.meta;
    }
    get includes() {
        var _a;
        return (_a = this._realData.includes) !== null && _a !== void 0 ? _a : {};
    }
}
/** A generic PreviousableTwitterPaginator able to consume TweetV2 timelines. */
class TweetTimelineV2Paginator extends TweetsV2Paginator {
    refreshInstanceFromResult(response, isNextPage) {
        var _a;
        const result = response.data;
        const resultData = (_a = result.data) !== null && _a !== void 0 ? _a : [];
        this._rateLimit = response.rateLimit;
        if (!this._realData.data) {
            this._realData.data = [];
        }
        if (isNextPage) {
            this._realData.meta.oldest_id = result.meta.oldest_id;
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.next_token = result.meta.next_token;
            this._realData.data.push(...resultData);
        }
        else {
            this._realData.meta.newest_id = result.meta.newest_id;
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.data.unshift(...resultData);
        }
        this.updateIncludes(result);
    }
    getNextQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            until_id: this._realData.meta.oldest_id,
        };
    }
    getPreviousQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            since_id: this._realData.meta.newest_id,
        };
    }
}
// ----------------
// - Tweet search -
// ----------------
class TweetSearchRecentV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'tweets/search/recent';
    }
}
exports.TweetSearchRecentV2Paginator = TweetSearchRecentV2Paginator;
class TweetSearchAllV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'tweets/search/all';
    }
}
exports.TweetSearchAllV2Paginator = TweetSearchAllV2Paginator;
class TweetUserTimelineV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/tweets';
    }
}
exports.TweetUserTimelineV2Paginator = TweetUserTimelineV2Paginator;
class TweetUserMentionTimelineV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/mentions';
    }
}
exports.TweetUserMentionTimelineV2Paginator = TweetUserMentionTimelineV2Paginator;
// ---------------------------------------------------------------------------------
// - Tweet lists (consume tweets with pagination tokens instead of since/until id) -
// ---------------------------------------------------------------------------------
/** A generic TwitterPaginator able to consume TweetV2 timelines. */
class TweetListV2Paginator extends TweetsV2Paginator {
    refreshInstanceFromResult(response, isNextPage) {
        var _a;
        const result = response.data;
        const resultData = (_a = result.data) !== null && _a !== void 0 ? _a : [];
        this._rateLimit = response.rateLimit;
        if (!this._realData.data) {
            this._realData.data = [];
        }
        if (isNextPage) {
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.next_token = result.meta.next_token;
            this._realData.data.push(...resultData);
        }
        else {
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.previous_token = result.meta.previous_token;
            this._realData.data.unshift(...resultData);
        }
        this.updateIncludes(result);
    }
    getNextQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            pagination_token: this._realData.meta.next_token,
        };
    }
    getPreviousQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            pagination_token: this._realData.meta.previous_token,
        };
    }
}
class TweetV2UserLikedTweetsPaginator extends TweetListV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/liked_tweets';
    }
}
exports.TweetV2UserLikedTweetsPaginator = TweetV2UserLikedTweetsPaginator;


/***/ }),

/***/ 8985:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FriendshipsOutgoingV1Paginator = exports.FriendshipsIncomingV1Paginator = exports.UserSearchV1Paginator = void 0;
const TwitterPaginator_1 = __importDefault(__nccwpck_require__(5317));
const paginator_v1_1 = __nccwpck_require__(593);
/** A generic TwitterPaginator able to consume TweetV1 timelines. */
class UserSearchV1Paginator extends TwitterPaginator_1.default {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/search.json';
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.push(...result);
        }
    }
    getNextQueryParams(maxResults) {
        var _a;
        const previousPage = Number((_a = this._queryParams.page) !== null && _a !== void 0 ? _a : '1');
        return {
            ...this._queryParams,
            page: previousPage + 1,
            ...maxResults ? { count: maxResults } : {},
        };
    }
    getPageLengthFromRequest(result) {
        return result.data.length;
    }
    isFetchLastOver(result) {
        return !result.data.length;
    }
    getItemArray() {
        return this.users;
    }
    /**
     * Users returned by paginator.
     */
    get users() {
        return this._realData;
    }
}
exports.UserSearchV1Paginator = UserSearchV1Paginator;
class FriendshipsIncomingV1Paginator extends paginator_v1_1.CursoredV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'friendships/incoming.json';
        this._maxResultsWhenFetchLast = 5000;
    }
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.ids.push(...result.ids);
            this._realData.next_cursor = result.next_cursor;
        }
    }
    getPageLengthFromRequest(result) {
        return result.data.ids.length;
    }
    getItemArray() {
        return this.ids;
    }
    /**
     * Users IDs returned by paginator.
     */
    get ids() {
        return this._realData.ids;
    }
}
exports.FriendshipsIncomingV1Paginator = FriendshipsIncomingV1Paginator;
class FriendshipsOutgoingV1Paginator extends FriendshipsIncomingV1Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'friendships/outgoing.json';
    }
}
exports.FriendshipsOutgoingV1Paginator = FriendshipsOutgoingV1Paginator;


/***/ }),

/***/ 2178:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserFollowingV2Paginator = exports.UserFollowersV2Paginator = exports.UserMutingUsersV2Paginator = exports.UserBlockingUsersV2Paginator = void 0;
const TwitterPaginator_1 = __nccwpck_require__(5317);
/** A generic PreviousableTwitterPaginator able to consume UserV2 timelines. */
class UserTimelineV2Paginator extends TwitterPaginator_1.PreviousableTwitterPaginator {
    refreshInstanceFromResult(response, isNextPage) {
        var _a;
        const result = response.data;
        const resultData = (_a = result.data) !== null && _a !== void 0 ? _a : [];
        this._rateLimit = response.rateLimit;
        if (!this._realData.data) {
            this._realData.data = [];
        }
        if (isNextPage) {
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.next_token = result.meta.next_token;
            this._realData.data.push(...resultData);
        }
        else {
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.previous_token = result.meta.previous_token;
            this._realData.data.unshift(...resultData);
        }
        this.updateIncludes(result);
    }
    updateIncludes(data) {
        if (!data.includes) {
            return;
        }
        if (!this._realData.includes) {
            this._realData.includes = {};
        }
        const includesRealData = this._realData.includes;
        for (const [includeKey, includeArray] of Object.entries(data.includes)) {
            if (!includesRealData[includeKey]) {
                includesRealData[includeKey] = [];
            }
            includesRealData[includeKey] = [
                ...includesRealData[includeKey],
                ...includeArray,
            ];
        }
    }
    getNextQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            pagination_token: this._realData.meta.next_token,
        };
    }
    getPreviousQueryParams(maxResults) {
        return {
            ...this.injectQueryParams(maxResults),
            pagination_token: this._realData.meta.previous_token,
        };
    }
    getPageLengthFromRequest(result) {
        var _a, _b;
        return (_b = (_a = result.data.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    isFetchLastOver(result) {
        var _a;
        return !((_a = result.data.data) === null || _a === void 0 ? void 0 : _a.length) || !result.data.meta.next_token;
    }
    getItemArray() {
        return this.users;
    }
    /**
     * Users returned by paginator.
     */
    get users() {
        var _a;
        return (_a = this._realData.data) !== null && _a !== void 0 ? _a : [];
    }
    get meta() {
        return this._realData.meta;
    }
    get includes() {
        var _a;
        return (_a = this._realData.includes) !== null && _a !== void 0 ? _a : {};
    }
}
class UserBlockingUsersV2Paginator extends UserTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/blocking';
    }
}
exports.UserBlockingUsersV2Paginator = UserBlockingUsersV2Paginator;
class UserMutingUsersV2Paginator extends UserTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/muting';
    }
}
exports.UserMutingUsersV2Paginator = UserMutingUsersV2Paginator;
class UserFollowersV2Paginator extends UserTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/followers';
    }
}
exports.UserFollowersV2Paginator = UserFollowersV2Paginator;
class UserFollowingV2Paginator extends UserTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/following';
    }
}
exports.UserFollowingV2Paginator = UserFollowingV2Paginator;


/***/ }),

/***/ 6273:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwitterApiV2Settings = void 0;
exports.TwitterApiV2Settings = {
    debug: false,
    deprecationWarnings: true,
};


/***/ }),

/***/ 9362:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TweetStream = void 0;
const events_1 = __nccwpck_require__(8614);
const request_handler_helper_1 = __importDefault(__nccwpck_require__(3768));
const types_1 = __nccwpck_require__(1638);
const TweetStreamEventCombiner_1 = __importDefault(__nccwpck_require__(1132));
const TweetStreamParser_1 = __importStar(__nccwpck_require__(7467));
// In seconds
const basicRetriesAttempt = [5, 15, 30, 60, 90, 120, 180, 300, 600, 900];
// Default retry function
const basicReconnectRetry = tryOccurence => tryOccurence > basicRetriesAttempt.length
    ? 901000
    : basicRetriesAttempt[tryOccurence - 1] * 1000;
class TweetStream extends events_1.EventEmitter {
    constructor(requestData, req, res) {
        super();
        this.requestData = requestData;
        this.autoReconnect = false;
        this.autoReconnectRetries = 5;
        // 2 minutes without any Twitter signal
        this.keepAliveTimeoutMs = 1000 * 120;
        this.nextRetryTimeout = basicReconnectRetry;
        this.parser = new TweetStreamParser_1.default();
        this.connectionProcessRunning = false;
        this.onKeepAliveTimeout = this.onKeepAliveTimeout.bind(this);
        this.initEventsFromParser();
        if (req && res) {
            this.req = req;
            this.res = res;
            this.initEventsFromRequest();
        }
    }
    on(event, handler) {
        return super.on(event, handler);
    }
    initEventsFromRequest() {
        if (!this.req || !this.res) {
            throw new Error('TweetStream error: You cannot init TweetStream without a request and response object.');
        }
        const errorHandler = (err) => {
            this.emit(types_1.ETwitterStreamEvent.ConnectionError, err);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.ConnectionError,
                error: err,
                message: 'Connection lost or closed by Twitter.',
            });
            this.onConnectionError();
        };
        this.req.on('error', errorHandler);
        this.res.on('error', errorHandler);
        // Usually, connection should not be closed by Twitter!
        this.res.on('close', () => errorHandler(new Error('Connection closed by Twitter.')));
        this.res.on('data', (chunk) => {
            this.resetKeepAliveTimeout();
            if (chunk.toString() === '\r\n') {
                return this.emit(types_1.ETwitterStreamEvent.DataKeepAlive);
            }
            this.parser.push(chunk.toString());
        });
        // Starts the keep alive timeout
        this.resetKeepAliveTimeout();
    }
    initEventsFromParser() {
        const payloadIsError = this.requestData.payloadIsError;
        this.parser.on(TweetStreamParser_1.EStreamParserEvent.ParsedData, (eventData) => {
            if (payloadIsError && payloadIsError(eventData)) {
                this.emit(types_1.ETwitterStreamEvent.DataError, eventData);
                this.emit(types_1.ETwitterStreamEvent.Error, {
                    type: types_1.ETwitterStreamEvent.DataError,
                    error: eventData,
                    message: 'Twitter sent a payload that is detected as an error payload.',
                });
            }
            else {
                this.emit(types_1.ETwitterStreamEvent.Data, eventData);
            }
        });
        this.parser.on(TweetStreamParser_1.EStreamParserEvent.ParseError, (error) => {
            this.emit(types_1.ETwitterStreamEvent.TweetParseError, error);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.TweetParseError,
                error,
                message: 'Failed to parse stream data.',
            });
        });
    }
    resetKeepAliveTimeout() {
        this.unbindKeepAliveTimeout();
        if (this.keepAliveTimeoutMs !== Infinity) {
            this.keepAliveTimeout = setTimeout(this.onKeepAliveTimeout, this.keepAliveTimeoutMs);
        }
    }
    onKeepAliveTimeout() {
        this.emit(types_1.ETwitterStreamEvent.ConnectionLost);
        this.onConnectionError();
    }
    unbindTimeouts() {
        this.unbindRetryTimeout();
        this.unbindKeepAliveTimeout();
    }
    unbindKeepAliveTimeout() {
        if (this.keepAliveTimeout) {
            clearTimeout(this.keepAliveTimeout);
            this.keepAliveTimeout = undefined;
        }
    }
    unbindRetryTimeout() {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = undefined;
        }
    }
    closeWithoutEmit() {
        this.unbindTimeouts();
        if (this.res) {
            this.res.removeAllListeners();
            // Close response silentely
            this.res.destroy();
        }
        if (this.req) {
            this.req.removeAllListeners();
            // Close connection silentely
            this.req.destroy();
        }
    }
    /** Terminate connection to Twitter. */
    close() {
        this.emit(types_1.ETwitterStreamEvent.ConnectionClosed);
        this.closeWithoutEmit();
    }
    /** Unbind all listeners, and close connection. */
    destroy() {
        this.removeAllListeners();
        this.close();
    }
    /**
     * Make a new request that creates a new `TweetStream` instance with
     * the same parameters, and bind current listeners to new stream.
     */
    async clone() {
        const newRequest = new request_handler_helper_1.default(this.requestData);
        const newStream = await newRequest.makeRequestAsStream();
        // Clone attached listeners
        const listenerNames = this.eventNames();
        for (const listener of listenerNames) {
            const callbacks = this.listeners(listener);
            for (const callback of callbacks) {
                newStream.on(listener, callback);
            }
        }
        return newStream;
    }
    /** Start initial stream connection, setup options on current instance and returns itself. */
    async connect(options = {}) {
        if (typeof options.autoReconnect !== 'undefined') {
            this.autoReconnect = options.autoReconnect;
        }
        if (typeof options.autoReconnectRetries !== 'undefined') {
            this.autoReconnectRetries = options.autoReconnectRetries === 'unlimited'
                ? Infinity
                : options.autoReconnectRetries;
        }
        if (typeof options.keepAliveTimeout !== 'undefined') {
            this.keepAliveTimeoutMs = options.keepAliveTimeout === 'disable'
                ? Infinity
                : options.keepAliveTimeout;
        }
        if (typeof options.nextRetryTimeout !== 'undefined') {
            this.nextRetryTimeout = options.nextRetryTimeout;
        }
        // Make the connection
        this.unbindTimeouts();
        try {
            await this.reconnect();
        }
        catch (e) {
            this.emit(types_1.ETwitterStreamEvent.ConnectError, 0);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.ConnectError,
                error: e,
                message: 'Connect error - Initial connection just failed.',
            });
            // Only make a reconnection attempt if autoReconnect is true!
            // Otherwise, let error be propagated
            if (this.autoReconnect) {
                this.makeAutoReconnectRetry(0, e);
            }
            else {
                throw e;
            }
        }
        return this;
    }
    /** Make a new request to (re)connect to Twitter. */
    async reconnect() {
        if (this.connectionProcessRunning) {
            throw new Error('Connection process is already running.');
        }
        this.connectionProcessRunning = true;
        try {
            let initialConnection = true;
            if (this.req) {
                initialConnection = false;
                this.closeWithoutEmit();
            }
            const { req, res } = await new request_handler_helper_1.default(this.requestData).makeRequestAndResolveWhenReady();
            this.req = req;
            this.res = res;
            this.emit(initialConnection ? types_1.ETwitterStreamEvent.Connected : types_1.ETwitterStreamEvent.Reconnected);
            this.parser.reset();
            this.initEventsFromRequest();
        }
        finally {
            this.connectionProcessRunning = false;
        }
    }
    async onConnectionError(retryOccurence = 0) {
        this.unbindTimeouts();
        // Close the request if necessary
        this.closeWithoutEmit();
        // Terminate stream by events if necessary (no auto-reconnect or retries exceeded)
        if (!this.autoReconnect) {
            this.emit(types_1.ETwitterStreamEvent.ConnectionClosed);
            return;
        }
        if (retryOccurence >= this.autoReconnectRetries) {
            this.emit(types_1.ETwitterStreamEvent.ReconnectLimitExceeded);
            this.emit(types_1.ETwitterStreamEvent.ConnectionClosed);
            return;
        }
        // If all other conditions fails, do a reconnect attempt
        try {
            this.emit(types_1.ETwitterStreamEvent.ReconnectAttempt, retryOccurence);
            await this.reconnect();
        }
        catch (e) {
            this.emit(types_1.ETwitterStreamEvent.ReconnectError, retryOccurence);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.ReconnectError,
                error: e,
                message: `Reconnect error - ${retryOccurence + 1} attempts made yet.`,
            });
            this.makeAutoReconnectRetry(retryOccurence, e);
        }
    }
    makeAutoReconnectRetry(retryOccurence, error) {
        const nextRetry = this.nextRetryTimeout(retryOccurence + 1, error);
        this.retryTimeout = setTimeout(() => {
            this.onConnectionError(retryOccurence + 1);
        }, nextRetry);
    }
    async *[Symbol.asyncIterator]() {
        const eventCombiner = new TweetStreamEventCombiner_1.default(this);
        try {
            while (true) {
                if (!this.req || this.req.aborted) {
                    throw new Error('Connection closed');
                }
                if (eventCombiner.hasStack()) {
                    yield* eventCombiner.popStack();
                }
                const { type, payload } = await eventCombiner.nextEvent();
                if (type === 'error') {
                    throw payload;
                }
            }
        }
        finally {
            eventCombiner.destroy();
        }
    }
}
exports.TweetStream = TweetStream;
exports.default = TweetStream;


/***/ }),

/***/ 1132:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TweetStreamEventCombiner = void 0;
const events_1 = __nccwpck_require__(8614);
const types_1 = __nccwpck_require__(1638);
class TweetStreamEventCombiner extends events_1.EventEmitter {
    constructor(stream) {
        super();
        this.stream = stream;
        this.stack = [];
        this.onStreamData = this.onStreamData.bind(this);
        this.onStreamError = this.onStreamError.bind(this);
        this.onceNewEvent = this.once.bind(this, 'event');
        // Init events from stream
        stream.on(types_1.ETwitterStreamEvent.Data, this.onStreamData);
        // Ignore reconnect errors: Don't close event combiner until connection error/closed
        stream.on(types_1.ETwitterStreamEvent.ConnectionError, this.onStreamError);
        stream.on(types_1.ETwitterStreamEvent.TweetParseError, this.onStreamError);
        stream.on(types_1.ETwitterStreamEvent.ConnectionClosed, this.onStreamError);
    }
    /** Returns a new `Promise` that will `resolve` on next event (`data` or any sort of error). */
    nextEvent() {
        return new Promise(this.onceNewEvent);
    }
    /** Returns `true` if there's something in the stack. */
    hasStack() {
        return this.stack.length > 0;
    }
    /** Returns stacked data events, and clean the stack. */
    popStack() {
        const stack = this.stack;
        this.stack = [];
        return stack;
    }
    /** Cleanup all the listeners attached on stream. */
    destroy() {
        this.removeAllListeners();
        this.stream.off(types_1.ETwitterStreamEvent.Data, this.onStreamData);
        this.stream.off(types_1.ETwitterStreamEvent.ConnectionError, this.onStreamError);
        this.stream.off(types_1.ETwitterStreamEvent.TweetParseError, this.onStreamError);
        this.stream.off(types_1.ETwitterStreamEvent.ConnectionClosed, this.onStreamError);
    }
    emitEvent(type, payload) {
        this.emit('event', { type, payload });
    }
    onStreamError(payload) {
        this.emitEvent('error', payload);
    }
    onStreamData(payload) {
        this.stack.push(payload);
        this.emitEvent('data', payload);
    }
}
exports.TweetStreamEventCombiner = TweetStreamEventCombiner;
exports.default = TweetStreamEventCombiner;


/***/ }),

/***/ 7467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EStreamParserEvent = void 0;
const events_1 = __nccwpck_require__(8614);
class TweetStreamParser extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.currentMessage = '';
    }
    // Code partially belongs to twitter-stream-api for this
    // https://github.com/trygve-lie/twitter-stream-api/blob/master/lib/parser.js
    push(chunk) {
        this.currentMessage += chunk;
        chunk = this.currentMessage;
        const size = chunk.length;
        let start = 0;
        let offset = 0;
        while (offset < size) {
            // Take [offset, offset+1] inside a new string
            if (chunk.slice(offset, offset + 2) === '\r\n') {
                // If chunk contains \r\n after current offset,
                // parse [start, ..., offset] as a tweet
                const piece = chunk.slice(start, offset);
                start = offset += 2;
                // If empty object
                if (!piece.length) {
                    continue;
                }
                try {
                    const payload = JSON.parse(piece);
                    if (payload) {
                        this.emit(EStreamParserEvent.ParsedData, payload);
                        continue;
                    }
                }
                catch (error) {
                    this.emit(EStreamParserEvent.ParseError, error);
                }
            }
            offset++;
        }
        this.currentMessage = chunk.slice(start, size);
    }
    /** Reset the currently stored message (f.e. on connection reset) */
    reset() {
        this.currentMessage = '';
    }
}
exports.default = TweetStreamParser;
var EStreamParserEvent;
(function (EStreamParserEvent) {
    EStreamParserEvent["ParsedData"] = "parsed data";
    EStreamParserEvent["ParseError"] = "parse error";
})(EStreamParserEvent = exports.EStreamParserEvent || (exports.EStreamParserEvent = {}));


/***/ }),

/***/ 8294:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 948:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ETwitterStreamEvent = void 0;
var ETwitterStreamEvent;
(function (ETwitterStreamEvent) {
    ETwitterStreamEvent["Connected"] = "connected";
    ETwitterStreamEvent["ConnectError"] = "connect error";
    ETwitterStreamEvent["ConnectionError"] = "connection error";
    ETwitterStreamEvent["ConnectionClosed"] = "connection closed";
    ETwitterStreamEvent["ConnectionLost"] = "connection lost";
    ETwitterStreamEvent["ReconnectAttempt"] = "reconnect attempt";
    ETwitterStreamEvent["Reconnected"] = "reconnected";
    ETwitterStreamEvent["ReconnectError"] = "reconnect error";
    ETwitterStreamEvent["ReconnectLimitExceeded"] = "reconnect limit exceeded";
    ETwitterStreamEvent["DataKeepAlive"] = "data keep-alive";
    ETwitterStreamEvent["Data"] = "data event content";
    ETwitterStreamEvent["DataError"] = "data twitter error";
    ETwitterStreamEvent["TweetParseError"] = "data tweet parse error";
    ETwitterStreamEvent["Error"] = "stream error";
})(ETwitterStreamEvent = exports.ETwitterStreamEvent || (exports.ETwitterStreamEvent = {}));


/***/ }),

/***/ 3549:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EApiV2ErrorCode = exports.EApiV1ErrorCode = exports.ApiResponseError = exports.ApiRequestError = exports.ETwitterApiError = void 0;
var ETwitterApiError;
(function (ETwitterApiError) {
    ETwitterApiError["Request"] = "request";
    ETwitterApiError["Response"] = "response";
})(ETwitterApiError = exports.ETwitterApiError || (exports.ETwitterApiError = {}));
/* ERRORS INSTANCES */
class ApiError extends Error {
    constructor() {
        super(...arguments);
        this.error = true;
    }
}
class ApiRequestError extends ApiError {
    constructor(message, options) {
        super(message);
        this.type = ETwitterApiError.Request;
        Error.captureStackTrace(this, this.constructor);
        // Do not show on Node stack trace
        Object.defineProperty(this, '_options', { value: options });
    }
    get request() {
        return this._options.request;
    }
    get requestError() {
        return this._options.requestError;
    }
    toJSON() {
        return {
            type: this.type,
            error: this.requestError,
        };
    }
}
exports.ApiRequestError = ApiRequestError;
class ApiResponseError extends ApiError {
    constructor(message, options) {
        super(message);
        this.type = ETwitterApiError.Response;
        Error.captureStackTrace(this, this.constructor);
        // Do not show on Node stack trace
        Object.defineProperty(this, '_options', { value: options });
        this.code = options.code;
        this.headers = options.headers;
        this.rateLimit = options.rateLimit;
        this.data = options.data;
    }
    get request() {
        return this._options.request;
    }
    get response() {
        return this._options.response;
    }
    /** Check for presence of one of given v1/v2 error codes. */
    hasErrorCode(...codes) {
        const errors = this.errors;
        // No errors
        if (!(errors === null || errors === void 0 ? void 0 : errors.length)) {
            return false;
        }
        // v1 errors
        if ('code' in errors[0]) {
            const v1errors = errors;
            return v1errors.some(error => codes.includes(error.code));
        }
        // v2 error
        const v2error = this.data;
        return codes.includes(v2error.type);
    }
    get errors() {
        var _a;
        return (_a = this.data) === null || _a === void 0 ? void 0 : _a.errors;
    }
    get rateLimitError() {
        return this.code === 420 || this.code === 429;
    }
    get isAuthError() {
        if (this.code === 401) {
            return true;
        }
        return this.hasErrorCode(EApiV1ErrorCode.AuthTimestampInvalid, EApiV1ErrorCode.AuthenticationFail, EApiV1ErrorCode.BadAuthenticationData, EApiV1ErrorCode.InvalidOrExpiredToken);
    }
    toJSON() {
        return {
            type: this.type,
            code: this.code,
            error: this.data,
            rateLimit: this.rateLimit,
            headers: this.headers,
        };
    }
}
exports.ApiResponseError = ApiResponseError;
var EApiV1ErrorCode;
(function (EApiV1ErrorCode) {
    // Location errors
    EApiV1ErrorCode[EApiV1ErrorCode["InvalidCoordinates"] = 3] = "InvalidCoordinates";
    EApiV1ErrorCode[EApiV1ErrorCode["NoLocationFound"] = 13] = "NoLocationFound";
    // Authentification failures
    EApiV1ErrorCode[EApiV1ErrorCode["AuthenticationFail"] = 32] = "AuthenticationFail";
    EApiV1ErrorCode[EApiV1ErrorCode["InvalidOrExpiredToken"] = 89] = "InvalidOrExpiredToken";
    EApiV1ErrorCode[EApiV1ErrorCode["UnableToVerifyCredentials"] = 99] = "UnableToVerifyCredentials";
    EApiV1ErrorCode[EApiV1ErrorCode["AuthTimestampInvalid"] = 135] = "AuthTimestampInvalid";
    EApiV1ErrorCode[EApiV1ErrorCode["BadAuthenticationData"] = 215] = "BadAuthenticationData";
    // Resources not found or visible
    EApiV1ErrorCode[EApiV1ErrorCode["NoUserMatch"] = 17] = "NoUserMatch";
    EApiV1ErrorCode[EApiV1ErrorCode["UserNotFound"] = 50] = "UserNotFound";
    EApiV1ErrorCode[EApiV1ErrorCode["ResourceNotFound"] = 34] = "ResourceNotFound";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetNotFound"] = 144] = "TweetNotFound";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetNotVisible"] = 179] = "TweetNotVisible";
    EApiV1ErrorCode[EApiV1ErrorCode["NotAllowedResource"] = 220] = "NotAllowedResource";
    EApiV1ErrorCode[EApiV1ErrorCode["MediaIdNotFound"] = 325] = "MediaIdNotFound";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetNoLongerAvailable"] = 421] = "TweetNoLongerAvailable";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetViolatedRules"] = 422] = "TweetViolatedRules";
    // Account errors
    EApiV1ErrorCode[EApiV1ErrorCode["TargetUserSuspended"] = 63] = "TargetUserSuspended";
    EApiV1ErrorCode[EApiV1ErrorCode["YouAreSuspended"] = 64] = "YouAreSuspended";
    EApiV1ErrorCode[EApiV1ErrorCode["AccountUpdateFailed"] = 120] = "AccountUpdateFailed";
    EApiV1ErrorCode[EApiV1ErrorCode["NoSelfSpamReport"] = 36] = "NoSelfSpamReport";
    EApiV1ErrorCode[EApiV1ErrorCode["NoSelfMute"] = 271] = "NoSelfMute";
    EApiV1ErrorCode[EApiV1ErrorCode["AccountLocked"] = 326] = "AccountLocked";
    // Application live errors / Twitter errors
    EApiV1ErrorCode[EApiV1ErrorCode["RateLimitExceeded"] = 88] = "RateLimitExceeded";
    EApiV1ErrorCode[EApiV1ErrorCode["NoDMRightForApp"] = 93] = "NoDMRightForApp";
    EApiV1ErrorCode[EApiV1ErrorCode["OverCapacity"] = 130] = "OverCapacity";
    EApiV1ErrorCode[EApiV1ErrorCode["InternalError"] = 131] = "InternalError";
    EApiV1ErrorCode[EApiV1ErrorCode["TooManyFollowings"] = 161] = "TooManyFollowings";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetLimitExceeded"] = 185] = "TweetLimitExceeded";
    EApiV1ErrorCode[EApiV1ErrorCode["DuplicatedTweet"] = 187] = "DuplicatedTweet";
    EApiV1ErrorCode[EApiV1ErrorCode["TooManySpamReports"] = 205] = "TooManySpamReports";
    EApiV1ErrorCode[EApiV1ErrorCode["RequestLooksLikeSpam"] = 226] = "RequestLooksLikeSpam";
    EApiV1ErrorCode[EApiV1ErrorCode["NoWriteRightForApp"] = 261] = "NoWriteRightForApp";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetActionsDisabled"] = 425] = "TweetActionsDisabled";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetRepliesRestricted"] = 433] = "TweetRepliesRestricted";
    // Invalid request parameters
    EApiV1ErrorCode[EApiV1ErrorCode["NamedParameterMissing"] = 38] = "NamedParameterMissing";
    EApiV1ErrorCode[EApiV1ErrorCode["InvalidAttachmentUrl"] = 44] = "InvalidAttachmentUrl";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetTextTooLong"] = 186] = "TweetTextTooLong";
    EApiV1ErrorCode[EApiV1ErrorCode["MissingUrlParameter"] = 195] = "MissingUrlParameter";
    EApiV1ErrorCode[EApiV1ErrorCode["NoMultipleGifs"] = 323] = "NoMultipleGifs";
    EApiV1ErrorCode[EApiV1ErrorCode["InvalidMediaIds"] = 324] = "InvalidMediaIds";
    EApiV1ErrorCode[EApiV1ErrorCode["InvalidUrl"] = 407] = "InvalidUrl";
    EApiV1ErrorCode[EApiV1ErrorCode["TooManyTweetAttachments"] = 386] = "TooManyTweetAttachments";
    // Already sent/deleted item
    EApiV1ErrorCode[EApiV1ErrorCode["StatusAlreadyFavorited"] = 139] = "StatusAlreadyFavorited";
    EApiV1ErrorCode[EApiV1ErrorCode["FollowRequestAlreadySent"] = 160] = "FollowRequestAlreadySent";
    EApiV1ErrorCode[EApiV1ErrorCode["CannotUnmuteANonMutedAccount"] = 272] = "CannotUnmuteANonMutedAccount";
    EApiV1ErrorCode[EApiV1ErrorCode["TweetAlreadyRetweeted"] = 327] = "TweetAlreadyRetweeted";
    EApiV1ErrorCode[EApiV1ErrorCode["ReplyToDeletedTweet"] = 385] = "ReplyToDeletedTweet";
    // DM Errors
    EApiV1ErrorCode[EApiV1ErrorCode["DMReceiverNotFollowingYou"] = 150] = "DMReceiverNotFollowingYou";
    EApiV1ErrorCode[EApiV1ErrorCode["UnableToSendDM"] = 151] = "UnableToSendDM";
    EApiV1ErrorCode[EApiV1ErrorCode["MustAllowDMFromAnyone"] = 214] = "MustAllowDMFromAnyone";
    EApiV1ErrorCode[EApiV1ErrorCode["CannotSendDMToThisUser"] = 349] = "CannotSendDMToThisUser";
    EApiV1ErrorCode[EApiV1ErrorCode["DMTextTooLong"] = 354] = "DMTextTooLong";
    // Appication misconfiguration
    EApiV1ErrorCode[EApiV1ErrorCode["SubscriptionAlreadyExists"] = 355] = "SubscriptionAlreadyExists";
    EApiV1ErrorCode[EApiV1ErrorCode["CallbackUrlNotApproved"] = 415] = "CallbackUrlNotApproved";
    EApiV1ErrorCode[EApiV1ErrorCode["SuspendedApplication"] = 416] = "SuspendedApplication";
    EApiV1ErrorCode[EApiV1ErrorCode["OobOauthIsNotAllowed"] = 417] = "OobOauthIsNotAllowed";
})(EApiV1ErrorCode = exports.EApiV1ErrorCode || (exports.EApiV1ErrorCode = {}));
var EApiV2ErrorCode;
(function (EApiV2ErrorCode) {
    // Request errors
    EApiV2ErrorCode["InvalidRequest"] = "https://api.twitter.com/2/problems/invalid-request";
    EApiV2ErrorCode["ClientForbidden"] = "https://api.twitter.com/2/problems/client-forbidden";
    EApiV2ErrorCode["UnsupportedAuthentication"] = "https://api.twitter.com/2/problems/unsupported-authentication";
    // Stream rules errors
    EApiV2ErrorCode["InvalidRules"] = "https://api.twitter.com/2/problems/invalid-rules";
    EApiV2ErrorCode["TooManyRules"] = "https://api.twitter.com/2/problems/rule-cap";
    EApiV2ErrorCode["DuplicatedRules"] = "https://api.twitter.com/2/problems/duplicate-rules";
    // Twitter errors
    EApiV2ErrorCode["RateLimitExceeded"] = "https://api.twitter.com/2/problems/usage-capped";
    EApiV2ErrorCode["ConnectionError"] = "https://api.twitter.com/2/problems/streaming-connection";
    EApiV2ErrorCode["ClientDisconnected"] = "https://api.twitter.com/2/problems/client-disconnected";
    EApiV2ErrorCode["TwitterDisconnectedYou"] = "https://api.twitter.com/2/problems/operational-disconnect";
    // Resource errors
    EApiV2ErrorCode["ResourceNotFound"] = "https://api.twitter.com/2/problems/resource-not-found";
    EApiV2ErrorCode["ResourceUnauthorized"] = "https://api.twitter.com/2/problems/not-authorized-for-resource";
    EApiV2ErrorCode["DisallowedResource"] = "https://api.twitter.com/2/problems/disallowed-resource";
})(EApiV2ErrorCode = exports.EApiV2ErrorCode || (exports.EApiV2ErrorCode = {}));


/***/ }),

/***/ 1638:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(5401), exports);
__exportStar(__nccwpck_require__(7109), exports);
__exportStar(__nccwpck_require__(3549), exports);
__exportStar(__nccwpck_require__(6296), exports);
__exportStar(__nccwpck_require__(948), exports);
__exportStar(__nccwpck_require__(8294), exports);


/***/ }),

/***/ 6296:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9740:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6430:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EDirectMessageEventTypeV1 = void 0;
// Creation of DMs
var EDirectMessageEventTypeV1;
(function (EDirectMessageEventTypeV1) {
    EDirectMessageEventTypeV1["Create"] = "message_create";
    EDirectMessageEventTypeV1["WelcomeCreate"] = "welcome_message";
})(EDirectMessageEventTypeV1 = exports.EDirectMessageEventTypeV1 || (exports.EDirectMessageEventTypeV1 = {}));


/***/ }),

/***/ 1575:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 712:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5401:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(2362), exports);
__exportStar(__nccwpck_require__(3863), exports);
__exportStar(__nccwpck_require__(1575), exports);
__exportStar(__nccwpck_require__(9045), exports);
__exportStar(__nccwpck_require__(9740), exports);
__exportStar(__nccwpck_require__(712), exports);
__exportStar(__nccwpck_require__(9622), exports);
__exportStar(__nccwpck_require__(6430), exports);
__exportStar(__nccwpck_require__(3268), exports);


/***/ }),

/***/ 3268:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2362:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9622:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 3863:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9045:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(3026), exports);
__exportStar(__nccwpck_require__(7295), exports);
__exportStar(__nccwpck_require__(5894), exports);
__exportStar(__nccwpck_require__(4292), exports);
__exportStar(__nccwpck_require__(7323), exports);
__exportStar(__nccwpck_require__(970), exports);


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7323:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 3026:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// ---------------
// -- Streaming --
// ---------------
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5894:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7295:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 4292:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwitterApiv1 = void 0;
const globals_1 = __nccwpck_require__(3444);
const dm_paginator_v1_1 = __nccwpck_require__(823);
const types_1 = __nccwpck_require__(1638);
const client_v1_write_1 = __importDefault(__nccwpck_require__(6685));
/**
 * Twitter v1.1 API client with read/write/DMs rights.
 */
class TwitterApiv1 extends client_v1_write_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /**
     * Get a client with read/write rights.
     */
    get readWrite() {
        return this;
    }
    /* Direct messages */
    // Part: Sending and receiving events
    /**
     * Publishes a new message_create event resulting in a Direct Message sent to a specified user from the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/new-event
     */
    sendDm({ recipient_id, custom_profile_id, ...params }) {
        const args = {
            event: {
                type: types_1.EDirectMessageEventTypeV1.Create,
                [types_1.EDirectMessageEventTypeV1.Create]: {
                    target: { recipient_id },
                    message_data: params,
                },
            },
        };
        if (custom_profile_id) {
            args.event[types_1.EDirectMessageEventTypeV1.Create].custom_profile_id = custom_profile_id;
        }
        return this.post('direct_messages/events/new.json', args, {
            forceBodyMode: 'json',
        });
    }
    /**
     * Returns a single Direct Message event by the given id.
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/get-event
     */
    getDmEvent(id) {
        return this.get('direct_messages/events/show.json', { id });
    }
    /**
     * Deletes the direct message specified in the required ID parameter.
     * The authenticating user must be the recipient of the specified direct message.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/delete-message-event
     */
    deleteDm(id) {
        return this.delete('direct_messages/events/destroy.json', { id });
    }
    /**
     * Returns all Direct Message events (both sent and received) within the last 30 days.
     * Sorted in reverse-chronological order.
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/list-events
     */
    async listDmEvents(args = {}) {
        const queryParams = { ...args };
        const initialRq = await this.get('direct_messages/events/list.json', queryParams, { fullResponse: true });
        return new dm_paginator_v1_1.DmEventsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    // Part: Welcome messages (events)
    /**
     * Creates a new Welcome Message that will be stored and sent in the future from the authenticating user in defined circumstances.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/new-welcome-message
     */
    newWelcomeDm(name, data) {
        const args = {
            [types_1.EDirectMessageEventTypeV1.WelcomeCreate]: {
                name,
                message_data: data,
            },
        };
        return this.post('direct_messages/welcome_messages/new.json', args, {
            forceBodyMode: 'json',
        });
    }
    /**
     * Returns a Welcome Message by the given id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/get-welcome-message
     */
    getWelcomeDm(id) {
        return this.get('direct_messages/welcome_messages/show.json', { id });
    }
    /**
     * Deletes a Welcome Message by the given id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/delete-welcome-message
     */
    deleteWelcomeDm(id) {
        return this.delete('direct_messages/welcome_messages/destroy.json', { id });
    }
    /**
     * Updates a Welcome Message by the given ID.
     * Updates to the welcome_message object are atomic.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/update-welcome-message
     */
    updateWelcomeDm(id, data) {
        const args = { message_data: data };
        return this.put('direct_messages/welcome_messages/update.json', args, {
            forceBodyMode: 'json',
            query: { id },
        });
    }
    /**
     * Returns all Direct Message events (both sent and received) within the last 30 days.
     * Sorted in reverse-chronological order.
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/list-events
     */
    async listWelcomeDms(args = {}) {
        const queryParams = { ...args };
        const initialRq = await this.get('direct_messages/welcome_messages/list.json', queryParams, { fullResponse: true });
        return new dm_paginator_v1_1.WelcomeDmV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    // Part: Welcome message (rules)
    /**
     * Creates a new Welcome Message Rule that determines which Welcome Message will be shown in a given conversation.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/new-welcome-message-rule
     */
    newWelcomeDmRule(welcomeMessageId) {
        return this.post('direct_messages/welcome_messages/rules/new.json', {
            welcome_message_rule: { welcome_message_id: welcomeMessageId },
        }, {
            forceBodyMode: 'json',
        });
    }
    /**
     * Returns a Welcome Message Rule by the given id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/get-welcome-message-rule
     */
    getWelcomeDmRule(id) {
        return this.get('direct_messages/welcome_messages/rules/show.json', { id });
    }
    /**
     * Deletes a Welcome Message Rule by the given id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/delete-welcome-message-rule
     */
    deleteWelcomeDmRule(id) {
        return this.delete('direct_messages/welcome_messages/rules/destroy.json', { id });
    }
    /**
     * Retrieves all welcome DM rules for this account.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/welcome-messages/api-reference/list-welcome-message-rules
     */
    async listWelcomeDmRules(args = {}) {
        const queryParams = { ...args };
        return this.get('direct_messages/welcome_messages/rules/list.json', queryParams);
    }
    /**
     * Set the current showed welcome message for logged account ; wrapper for Welcome DM rules.
     * Test if a rule already exists, delete if any, then create a rule for current message ID.
     *
     * If you don't have already a welcome message, create it with `.newWelcomeMessage`.
     */
    async setWelcomeDm(welcomeMessageId, deleteAssociatedWelcomeDmWhenDeletingRule = true) {
        var _a;
        const existingRules = await this.listWelcomeDmRules();
        if ((_a = existingRules.welcome_message_rules) === null || _a === void 0 ? void 0 : _a.length) {
            for (const rule of existingRules.welcome_message_rules) {
                await this.deleteWelcomeDmRule(rule.id);
                if (deleteAssociatedWelcomeDmWhenDeletingRule) {
                    await this.deleteWelcomeDm(rule.welcome_message_id);
                }
            }
        }
        return this.newWelcomeDmRule(welcomeMessageId);
    }
    // Part: Read indicator
    /**
     * Marks a message as read in the recipient’s Direct Message conversation view with the sender.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/typing-indicator-and-read-receipts/api-reference/new-read-receipt
     */
    markDmAsRead(lastEventId, recipientId) {
        return this.post('direct_messages/mark_read.json', {
            last_read_event_id: lastEventId,
            recipient_id: recipientId,
        }, { forceBodyMode: 'url' });
    }
    /**
     * Displays a visual typing indicator in the recipient’s Direct Message conversation view with the sender.
     * https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/typing-indicator-and-read-receipts/api-reference/new-typing-indicator
     */
    indicateDmTyping(recipientId) {
        return this.post('direct_messages/indicate_typing.json', {
            recipient_id: recipientId,
        }, { forceBodyMode: 'url' });
    }
}
exports.TwitterApiv1 = TwitterApiv1;
exports.default = TwitterApiv1;


/***/ }),

/***/ 4273:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_subclient_1 = __importDefault(__nccwpck_require__(3810));
const globals_1 = __nccwpck_require__(3444);
const helpers_1 = __nccwpck_require__(1120);
const client_v1_1 = __importDefault(__nccwpck_require__(7030));
const tweet_paginator_v1_1 = __nccwpck_require__(9848);
const mutes_paginator_v1_1 = __nccwpck_require__(7277);
const user_paginator_v1_1 = __nccwpck_require__(8985);
const list_paginator_v1_1 = __nccwpck_require__(5631);
/**
 * Base Twitter v1 client with only read right.
 */
class TwitterApiv1ReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /* Tweets */
    /**
     * Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id
     */
    singleTweet(tweetId, options = {}) {
        return this.get('statuses/show.json', { tweet_mode: 'extended', id: tweetId, ...options });
    }
    tweets(ids, options = {}) {
        return this.post('statuses/lookup.json', { tweet_mode: 'extended', id: ids, ...options });
    }
    /**
     * Returns a single Tweet, specified by either a Tweet web URL or the Tweet ID, in an oEmbed-compatible format.
     * The returned HTML snippet will be automatically recognized as an Embedded Tweet when Twitter's widget JavaScript is included on the page.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
     */
    oembedTweet(tweetId, options = {}) {
        return this.get('oembed', {
            url: `https://twitter.com/i/statuses/${tweetId}`,
            ...options,
        }, { prefix: 'https://publish.twitter.com/' });
    }
    /* Tweets timelines */
    /**
     * Returns a collection of the most recent Tweets and Retweets posted by the authenticating user and the users they follow.
     * The home timeline is central to how most users interact with the Twitter service.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-home_timeline
     */
    async homeTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/home_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.HomeTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the 20 most recent mentions (Tweets containing a users's @screen_name) for the authenticating user.
     * The timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-mentions_timeline
     */
    async mentionTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/mentions_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.MentionTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the user_id parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimeline(userId, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            user_id: userId,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the screen_name parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimelineByUsername(username, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            screen_name: username,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Users */
    /**
     * Returns a variety of information about the user specified by the required user_id or screen_name parameter.
     * The author's most recent Tweet will be returned inline when possible.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-show
     */
    user(user) {
        return this.get('users/show.json', { tweet_mode: 'extended', ...user });
    }
    /**
     * Returns fully-hydrated user objects for up to 100 users per request,
     * as specified by comma-separated values passed to the user_id and/or screen_name parameters.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
     */
    users(query) {
        return this.get('users/lookup.json', { tweet_mode: 'extended', ...query });
    }
    /**
     * Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful;
     * returns a 401 status code and an error message if not.
     * Use this method to test if supplied user credentials are valid.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
     */
    verifyCredentials(options = {}) {
        return this.get('account/verify_credentials.json', options);
    }
    /**
     * Returns an array of user objects the authenticating user has muted.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/get-mutes-users-list
     */
    async listMutedUsers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('mutes/users/list.json', queryParams, { fullResponse: true });
        return new mutes_paginator_v1_1.MuteUserListV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns an array of numeric user ids the authenticating user has muted.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/get-mutes-users-ids
     */
    async listMutedUserIds(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('mutes/users/ids.json', queryParams, { fullResponse: true });
        return new mutes_paginator_v1_1.MuteUserIdsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Provides a simple, relevance-based search interface to public user accounts on Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-search
     */
    async searchUsers(query, options = {}) {
        const queryParams = {
            q: query,
            tweet_mode: 'extended',
            page: 1,
            ...options,
        };
        const initialRq = await this.get('users/search.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.UserSearchV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Friendship API */
    /**
     * Returns detailed information about the relationship between two arbitrary users.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-show
     */
    friendship(sources) {
        return this.get('friendships/show.json', sources);
    }
    /**
     * Returns the relationships of the authenticating user to the comma-separated list of up to 100 screen_names or user_ids provided.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-lookup
     */
    friendships(friendships) {
        return this.get('friendships/lookup.json', friendships);
    }
    /**
     * Returns a collection of user_ids that the currently authenticated user does not want to receive retweets from.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-no_retweets-ids
     */
    friendshipsNoRetweets() {
        return this.get('friendships/no_retweets/ids.json', { stringify_ids: true });
    }
    /**
     * Returns a collection of numeric IDs for every user who has a pending request to follow the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-incoming
     */
    async friendshipsIncoming(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('friendships/incoming.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.FriendshipsIncomingV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of numeric IDs for every protected user for whom the authenticating user has a pending follow request.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-outgoing
     */
    async friendshipsOutgoing(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('friendships/outgoing.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.FriendshipsOutgoingV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Account/user API */
    /**
     * Get current account settings for authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-settings
     */
    accountSettings() {
        return this.get('account/settings.json');
    }
    /**
     * Returns a map of the available size variations of the specified user's profile banner.
     * If the user has not uploaded a profile banner, a HTTP 404 will be served instead.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-users-profile_banner
     */
    userProfileBannerSizes(params) {
        return this.get('users/profile_banner.json', params);
    }
    /* Lists */
    /**
     * Returns the specified list. Private lists will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-show
     */
    list(options) {
        return this.get('lists/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns all lists the authenticating or specified user subscribes to, including their own.
     * If no user is given, the authenticating user is used.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-list
     */
    lists(options = {}) {
        return this.get('lists/list.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns the members of the specified list. Private list members will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-members
     */
    async listMembers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/members.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListMembersV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Check if the specified user is a member of the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-members-show
     */
    listGetMember(options) {
        return this.get('lists/members/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns the lists the specified user has been added to.
     * If user_id or screen_name are not provided, the memberships for the authenticating user are returned.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-memberships
     */
    async listMemberships(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/memberships.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListMembershipsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the lists owned by the specified Twitter user. Private lists will only be shown if the authenticated user is also the owner of the lists.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-ownerships
     */
    async listOwnerships(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/ownerships.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListOwnershipsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a timeline of tweets authored by members of the specified list. Retweets are included by default.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-statuses
     */
    async listStatuses(options) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/statuses.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.ListTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the subscribers of the specified list. Private list subscribers will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscribers
     */
    async listSubscribers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/subscribers.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListSubscribersV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Check if the specified user is a subscriber of the specified list. Returns the user if they are a subscriber.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscribers-show
     */
    listGetSubscriber(options) {
        return this.get('lists/subscribers/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Obtain a collection of the lists the specified user is subscribed to, 20 lists per page by default.
     * Does not include the user's own lists.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscriptions
     */
    async listSubscriptions(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/subscriptions.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListSubscriptionsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Media upload API */
    /**
     * The STATUS command (this method) is used to periodically poll for updates of media processing operation.
     * After the STATUS command response returns succeeded, you can move on to the next step which is usually create Tweet with media_id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/get-media-upload-status
     */
    mediaInfo(mediaId) {
        return this.get('media/upload.json', {
            command: 'STATUS',
            media_id: mediaId,
        }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
    }
    filterStream({ autoConnect, ...params } = {}) {
        const parameters = {};
        for (const [key, value] of Object.entries(params)) {
            if (key === 'follow' || key === 'track') {
                parameters[key] = value.toString();
            }
            else if (key === 'locations') {
                const locations = value;
                parameters.locations = helpers_1.arrayWrap(locations).map(loc => `${loc.lng},${loc.lat}`).join(',');
            }
            else {
                parameters[key] = value;
            }
        }
        const streamClient = this.stream;
        return streamClient.postStream('statuses/filter.json', parameters, { autoConnect });
    }
    sampleStream({ autoConnect, ...params } = {}) {
        const streamClient = this.stream;
        return streamClient.getStream('statuses/sample.json', params, { autoConnect });
    }
    /**
     * Create a client that is prefixed with `https//stream.twitter.com` instead of classic API URL.
     */
    get stream() {
        const copiedClient = new client_v1_1.default(this);
        copiedClient.setPrefix(globals_1.API_V1_1_STREAM_PREFIX);
        return copiedClient;
    }
    /* Trends API */
    /**
     * Returns the top 50 trending topics for a specific id, if trending information is available for it.
     * Note: The id parameter for this endpoint is the "where on earth identifier" or WOEID, which is a legacy identifier created by Yahoo and has been deprecated.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place
     */
    trendsByPlace(woeId, options = {}) {
        return this.get('trends/place.json', { id: woeId, ...options });
    }
    /**
     * Returns the locations that Twitter has trending topic information for.
     * The response is an array of "locations" that encode the location's WOEID
     * and some other human-readable information such as a canonical name and country the location belongs in.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
     */
    trendsAvailable() {
        return this.get('trends/available.json');
    }
    /**
     * Returns the locations that Twitter has trending topic information for, closest to a specified location.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-closest
     */
    trendsClosest(lat, long) {
        return this.get('trends/closest.json', { lat, long });
    }
    /* Geo API */
    /**
     * Returns all the information about a known place.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id
     */
    geoPlace(placeId) {
        return this.get('geo/id/:place_id.json', undefined, { params: { place_id: placeId } });
    }
    /**
     * Search for places that can be attached to a Tweet via POST statuses/update.
     * This request will return a list of all the valid places that can be used as the place_id when updating a status.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-search
     */
    geoSearch(options) {
        return this.get('geo/search.json', options);
    }
    /**
     * Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.
     * This request is an informative call and will deliver generalized results about geography.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-reverse_geocode
     */
    geoReverseGeoCode(options) {
        return this.get('geo/reverse_geocode.json', options);
    }
    /* Developer utilities */
    /**
     * Returns the current rate limits for methods belonging to the specified resource families.
     * Each API resource belongs to a "resource family" which is indicated in its method documentation.
     * The method's resource family can be determined from the first component of the path after the resource version.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/rate-limit-status/api-reference/get-application-rate_limit_status
     */
    rateLimitStatuses(...resources) {
        return this.get('application/rate_limit_status.json', { resources });
    }
    /**
     * Returns the list of languages supported by Twitter along with the language code supported by Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/supported-languages/api-reference/get-help-languages
     */
    supportedLanguages() {
        return this.get('help/languages.json');
    }
}
exports.default = TwitterApiv1ReadOnly;


/***/ }),

/***/ 6685:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const globals_1 = __nccwpck_require__(3444);
const client_v1_read_1 = __importDefault(__nccwpck_require__(4273));
const fs = __importStar(__nccwpck_require__(5747));
const media_helpers_v1_1 = __nccwpck_require__(8738);
const helpers_1 = __nccwpck_require__(1120);
const UPLOAD_ENDPOINT = 'media/upload.json';
/**
 * Base Twitter v1 client with read/write rights.
 */
class TwitterApiv1ReadWrite extends client_v1_read_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /**
     * Get a client with only read rights.
     */
    get readOnly() {
        return this;
    }
    /* Tweet API */
    /**
     * Post a new tweet.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update
     */
    tweet(status, payload = {}) {
        const queryParams = {
            status,
            tweet_mode: 'extended',
            ...payload,
        };
        return this.post('statuses/update.json', queryParams);
    }
    /**
     * Post a series of tweets.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update
     */
    async tweetThread(tweets) {
        const postedTweets = [];
        for (const tweet of tweets) {
            // Retrieve the last sent tweet
            const lastTweet = postedTweets.length ? postedTweets[postedTweets.length - 1] : null;
            // Build the tweet query params
            const queryParams = { ...(typeof tweet === 'string' ? ({ status: tweet }) : tweet) };
            // Reply to an existing tweet if needed
            const inReplyToId = lastTweet ? lastTweet.id_str : queryParams.in_reply_to_status_id;
            const status = queryParams.status;
            if (inReplyToId) {
                postedTweets.push(await this.reply(status, inReplyToId, queryParams));
            }
            else {
                postedTweets.push(await this.tweet(status, queryParams));
            }
        }
        return postedTweets;
    }
    /**
     * Reply to an existing tweet. Shortcut to `.tweet` with tweaked parameters.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update
     */
    reply(status, in_reply_to_status_id, payload = {}) {
        return this.tweet(status, {
            auto_populate_reply_metadata: true,
            in_reply_to_status_id,
            ...payload,
        });
    }
    /**
     * Delete an existing tweet belonging to you.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-destroy-id
     */
    deleteTweet(tweetId) {
        return this.post('statuses/destroy/:id.json', { tweet_mode: 'extended' }, { params: { id: tweetId } });
    }
    /* User API */
    /**
     * Report the specified user as a spam account to Twitter.
     * Additionally, optionally performs the equivalent of POST blocks/create on behalf of the authenticated user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/post-users-report_spam
     */
    reportUserAsSpam(options) {
        return this.post('users/report_spam.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Turn on/off Retweets and device notifications from the specified user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/post-friendships-update
     */
    updateFriendship(options) {
        return this.post('friendships/update.json', options);
    }
    /* Account API */
    /**
     * Update current account settings for authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-settings
     */
    updateAccountSettings(options) {
        return this.post('account/settings.json', options);
    }
    /**
     * Sets some values that users are able to set under the "Account" tab of their settings page.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/post-account-update_profile
     */
    updateAccountProfile(options) {
        return this.post('account/update_profile.json', options);
    }
    /**
     * Uploads a profile banner on behalf of the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/post-account-update_profile_banner
     */
    async updateAccountProfileBanner(file, options = {}) {
        const queryParams = {
            banner: await media_helpers_v1_1.readFileIntoBuffer(file),
            ...options,
        };
        return this.post('account/update_profile_banner.json', queryParams, { forceBodyMode: 'form-data' });
    }
    /**
     * Updates the authenticating user's profile image.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/post-account-update_profile_image
     */
    async updateAccountProfileImage(file, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            image: await media_helpers_v1_1.readFileIntoBuffer(file),
            ...options,
        };
        return this.post('account/update_profile_image.json', queryParams, { forceBodyMode: 'form-data' });
    }
    /**
     * Removes the uploaded profile banner for the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/post-account-remove_profile_banner
     */
    removeAccountProfileBanner() {
        return this.post('account/remove_profile_banner.json');
    }
    /* Lists */
    /**
     * Creates a new list for the authenticated user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-create
     */
    createList(options) {
        return this.post('lists/create.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Updates the specified list. The authenticated user must own the list to be able to update it.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-update
     */
    updateList(options) {
        return this.post('lists/update.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Deletes the specified list. The authenticated user must own the list to be able to destroy it.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-destroy
     */
    removeList(options) {
        return this.post('lists/destroy.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Adds multiple members to a list, by specifying a comma-separated list of member ids or screen names.
     * If you add a single `user_id` or `screen_name`, it will target `lists/members/create.json`, otherwise
     * it will target `lists/members/create_all.json`.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create_all
     */
    addListMembers(options) {
        const hasMultiple = (options.user_id && helpers_1.hasMultipleItems(options.user_id)) || (options.screen_name && helpers_1.hasMultipleItems(options.screen_name));
        const endpoint = hasMultiple ? 'lists/members/create_all.json' : 'lists/members/create.json';
        return this.post(endpoint, options);
    }
    /**
     * Removes multiple members to a list, by specifying a comma-separated list of member ids or screen names.
     * If you add a single `user_id` or `screen_name`, it will target `lists/members/destroy.json`, otherwise
     * it will target `lists/members/destroy_all.json`.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-members-destroy_all
     */
    removeListMembers(options) {
        const hasMultiple = (options.user_id && helpers_1.hasMultipleItems(options.user_id)) || (options.screen_name && helpers_1.hasMultipleItems(options.screen_name));
        const endpoint = hasMultiple ? 'lists/members/destroy_all.json' : 'lists/members/destroy.json';
        return this.post(endpoint, options);
    }
    /**
     * Subscribes the authenticated user to the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-subscribers-create
     */
    subscribeToList(options) {
        return this.post('lists/subscribers/create.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Unsubscribes the authenticated user of the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-subscribers-destroy
     */
    unsubscribeOfList(options) {
        return this.post('lists/subscribers/destroy.json', { tweet_mode: 'extended', ...options });
    }
    /* Media upload API */
    /**
     * This endpoint can be used to provide additional information about the uploaded media_id.
     * This feature is currently only supported for images and GIFs.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-metadata-create
     */
    createMediaMetadata(mediaId, metadata) {
        return this.post('media/metadata/create.json', { media_id: mediaId, ...metadata }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
    /**
     * Use this endpoint to associate uploaded subtitles to an uploaded video. You can associate subtitles to video before or after Tweeting.
     * **To obtain subtitle media ID, you must upload each subtitle file separately using `.uploadMedia()` method.**
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-create
     */
    createMediaSubtitles(mediaId, subtitles) {
        return this.post('media/subtitles/create.json', { media_id: mediaId, media_category: 'TweetVideo', subtitle_info: { subtitles } }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
    /**
     * Use this endpoint to dissociate subtitles from a video and delete the subtitles. You can dissociate subtitles from a video before or after Tweeting.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-delete
     */
    deleteMediaSubtitles(mediaId, ...languages) {
        return this.post('media/subtitles/delete.json', {
            media_id: mediaId,
            media_category: 'TweetVideo',
            subtitle_info: { subtitles: languages.map(lang => ({ language_code: lang })) },
        }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
    /**
     * Upload a media (JPG/PNG/GIF/MP4/WEBP) or subtitle (SRT) to Twitter and return the media_id to use in tweet/DM send.
     *
     * @param file If `string`, filename is supposed.
     * A `Buffer` is a raw file.
     * `fs.promises.FileHandle` or `number` are file pointers.
     *
     * @param options.type File type (Enum 'jpg' | 'longmp4' | 'mp4' | 'png' | 'gif' | 'srt' | 'webp').
     * If filename is given, it could be guessed with file extension, otherwise this parameter is mandatory.
     * If type is not part of the enum, it will be used as mime type.
     *
     * Type `longmp4` is **required** is you try to upload a video higher than 140 seconds.
     *
     * @param options.chunkLength Maximum chunk length sent to Twitter. Default goes to 1 MB.
     *
     * @param options.additionalOwners Other user IDs allowed to use the returned media_id. Default goes to none.
     *
     * @param options.maxConcurrentUploads Maximum uploaded chunks in the same time. Default goes to 3.
     *
     * @param options.target Target type `tweet` or `dm`. Defaults to `tweet`.
     * You must specify it if you send a media to use in DMs.
     */
    async uploadMedia(file, options = {}) {
        var _a;
        const chunkLength = (_a = options.chunkLength) !== null && _a !== void 0 ? _a : (1024 * 1024);
        const { fileHandle, mediaCategory, fileSize, mimeType } = await this.getUploadMediaRequirements(file, options);
        // Get the file handle (if not buffer)
        try {
            // Finally! We can send INIT message.
            const mediaData = await this.post(UPLOAD_ENDPOINT, {
                command: 'INIT',
                total_bytes: fileSize,
                media_type: mimeType,
                media_category: mediaCategory,
                additional_owners: options.additionalOwners,
                shared: options.shared ? true : undefined,
            }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
            // Upload the media chunk by chunk
            await this.mediaChunkedUpload(fileHandle, chunkLength, mediaData.media_id_string, options.maxConcurrentUploads);
            // Finalize media
            const fullMediaData = await this.post(UPLOAD_ENDPOINT, {
                command: 'FINALIZE',
                media_id: mediaData.media_id_string,
            }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
            if (fullMediaData.processing_info && fullMediaData.processing_info.state !== 'succeeded') {
                // Must wait if video is still computed
                await this.awaitForMediaProcessingCompletion(fullMediaData);
            }
            // Video is ready, return media_id
            return fullMediaData.media_id_string;
        }
        finally {
            // Close file if any
            if (typeof file === 'number') {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                fs.close(file, () => { });
            }
            else if (typeof fileHandle === 'object' && !(fileHandle instanceof Buffer)) {
                fileHandle.close();
            }
        }
    }
    async awaitForMediaProcessingCompletion(fullMediaData) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            fullMediaData = await this.mediaInfo(fullMediaData.media_id_string);
            if (!fullMediaData.processing_info || fullMediaData.processing_info.state === 'succeeded') {
                // Ok, completed!
                return;
            }
            if (fullMediaData.processing_info.state === 'failed') {
                throw new Error('Failed to process the media.');
            }
            if (fullMediaData.processing_info.check_after_secs) {
                // Await for given seconds
                await media_helpers_v1_1.sleepSecs(fullMediaData.processing_info.check_after_secs);
            }
            else {
                // No info; Await for 5 seconds
                await media_helpers_v1_1.sleepSecs(5);
            }
        }
    }
    async getUploadMediaRequirements(file, { type, target } = {}) {
        // Get the file handle (if not buffer)
        let fileHandle;
        try {
            fileHandle = await media_helpers_v1_1.getFileHandle(file);
            // Get the mimetype
            const mimeType = media_helpers_v1_1.getMimeType(file, type);
            // Get the media category
            let mediaCategory;
            // If explicit longmp4 OR explicit MIME type and not DM target
            if (type === 'longmp4' || (type === 'video/mp4' && target !== 'dm')) {
                mediaCategory = 'amplify_video';
            }
            else {
                mediaCategory = media_helpers_v1_1.getMediaCategoryByMime(mimeType, target !== null && target !== void 0 ? target : 'tweet');
            }
            return {
                fileHandle,
                mediaCategory,
                fileSize: await media_helpers_v1_1.getFileSizeFromFileHandle(fileHandle),
                mimeType,
            };
        }
        catch (e) {
            // Close file if any
            if (typeof file === 'number') {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                fs.close(file, () => { });
            }
            else if (typeof fileHandle === 'object' && !(fileHandle instanceof Buffer)) {
                fileHandle.close();
            }
            throw e;
        }
    }
    async mediaChunkedUpload(fileHandle, chunkLength, mediaId, maxConcurrentUploads = 3) {
        // Send chunk by chunk
        let chunkIndex = 0;
        if (maxConcurrentUploads < 1) {
            throw new RangeError('Bad maxConcurrentUploads parameter.');
        }
        // Creating a buffer for doing file stuff (if we don't have one)
        const buffer = fileHandle instanceof Buffer ? undefined : Buffer.alloc(chunkLength);
        // Sliced/filled buffer returned for each part
        let readBuffer;
        // Needed to know when we should stop reading the file
        let nread;
        // Needed to use the buffer object (file handles always "remembers" file position)
        let offset = 0;
        [readBuffer, nread] = await media_helpers_v1_1.readNextPartOf(fileHandle, chunkLength, offset, buffer);
        offset += nread;
        // Handle max concurrent uploads
        const currentUploads = new Set();
        // Read buffer until file is completely read
        while (nread) {
            const mediaBufferPart = readBuffer.slice(0, nread);
            // Sent part if part has something inside
            if (mediaBufferPart.length) {
                const request = this.post(UPLOAD_ENDPOINT, {
                    command: 'APPEND',
                    media_id: mediaId,
                    segment_index: chunkIndex,
                    media: mediaBufferPart,
                }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
                currentUploads.add(request);
                request.then(() => {
                    currentUploads.delete(request);
                });
                chunkIndex++;
            }
            if (currentUploads.size >= maxConcurrentUploads) {
                // Await for first promise to be finished
                await Promise.race(currentUploads);
            }
            [readBuffer, nread] = await media_helpers_v1_1.readNextPartOf(fileHandle, chunkLength, offset, buffer);
            offset += nread;
        }
        await Promise.all([...currentUploads]);
    }
}
exports.default = TwitterApiv1ReadWrite;


/***/ }),

/***/ 8738:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readNextPartOf = exports.sleepSecs = exports.getMediaCategoryByMime = exports.getMimeType = exports.getFileSizeFromFileHandle = exports.getFileHandle = exports.readFileIntoBuffer = void 0;
const fs = __importStar(__nccwpck_require__(5747));
async function readFileIntoBuffer(file) {
    const handle = await getFileHandle(file);
    if (typeof handle === 'number') {
        return new Promise((resolve, reject) => {
            fs.readFile(handle, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    else if (handle instanceof Buffer) {
        return handle;
    }
    else {
        return handle.readFile();
    }
}
exports.readFileIntoBuffer = readFileIntoBuffer;
function getFileHandle(file) {
    if (typeof file === 'string') {
        return fs.promises.open(file, 'r');
    }
    else if (typeof file === 'number') {
        return file;
    }
    else if (typeof file === 'object' && !(file instanceof Buffer)) {
        return file;
    }
    else if (!(file instanceof Buffer)) {
        throw new Error('Given file is not valid, please check its type.');
    }
    else {
        return file;
    }
}
exports.getFileHandle = getFileHandle;
async function getFileSizeFromFileHandle(fileHandle) {
    // Get the file size
    if (typeof fileHandle === 'number') {
        const stats = await new Promise((resolve, reject) => {
            fs.fstat(fileHandle, (err, stats) => {
                if (err)
                    reject(err);
                resolve(stats);
            });
        });
        return stats.size;
    }
    else if (fileHandle instanceof Buffer) {
        return fileHandle.length;
    }
    else {
        return (await fileHandle.stat()).size;
    }
}
exports.getFileSizeFromFileHandle = getFileSizeFromFileHandle;
function getMimeType(file, type) {
    if (typeof file === 'string' && !type) {
        return getMimeByName(file);
    }
    else if (typeof type === 'string') {
        return getMimeByType(type);
    }
    throw new Error('You must specify type if file is a file handle or Buffer.');
}
exports.getMimeType = getMimeType;
function getMimeByName(name) {
    if (name.endsWith('.jpeg') || name.endsWith('.jpg'))
        return 'image/jpeg';
    if (name.endsWith('.png'))
        return 'image/png';
    if (name.endsWith('.webp'))
        return 'image/webp';
    if (name.endsWith('.gif'))
        return 'image/gif';
    if (name.endsWith('.mpeg4') || name.endsWith('.mp4'))
        return 'video/mp4';
    if (name.endsWith('.srt'))
        return 'text/plain';
    return 'image/jpeg';
}
function getMimeByType(type) {
    if (type === 'gif')
        return 'image/gif';
    if (type === 'jpg')
        return 'image/jpeg';
    if (type === 'png')
        return 'image/png';
    if (type === 'webp')
        return 'image/webp';
    if (type === 'srt')
        return 'text/plain';
    if (type === 'mp4' || type === 'longmp4')
        return 'video/mp4';
    return type;
}
function getMediaCategoryByMime(name, target) {
    if (name === 'video/mp4')
        return target === 'tweet' ? 'TweetVideo' : 'DmVideo';
    if (name === 'image/gif')
        return target === 'tweet' ? 'TweetGif' : 'DmGif';
    if (name === 'text/plain')
        return 'Subtitles';
    else
        return target === 'tweet' ? 'TweetImage' : 'DmImage';
}
exports.getMediaCategoryByMime = getMediaCategoryByMime;
function sleepSecs(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
exports.sleepSecs = sleepSecs;
async function readNextPartOf(file, chunkLength, bufferOffset = 0, buffer) {
    if (file instanceof Buffer) {
        const rt = file.slice(bufferOffset, bufferOffset + chunkLength);
        return [rt, rt.length];
    }
    if (!buffer) {
        throw new Error('Well, we will need a buffer to store file content.');
    }
    let bytesRead;
    if (typeof file === 'number') {
        bytesRead = await new Promise((resolve, reject) => {
            fs.read(file, buffer, 0, chunkLength, bufferOffset, (err, nread) => {
                if (err)
                    reject(err);
                resolve(nread);
            });
        });
    }
    else {
        const res = await file.read(buffer, 0, chunkLength, bufferOffset);
        bytesRead = res.bytesRead;
    }
    return [buffer, bytesRead];
}
exports.readNextPartOf = readNextPartOf;


/***/ }),

/***/ 1204:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwitterApiv2Labs = void 0;
const globals_1 = __nccwpck_require__(3444);
const client_v2_labs_write_1 = __importDefault(__nccwpck_require__(8191));
/**
 * Twitter v2 labs client with all rights (read/write/DMs)
 */
class TwitterApiv2Labs extends client_v2_labs_write_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_LABS_PREFIX;
    }
    /**
     * Get a client with read/write rights.
     */
    get readWrite() {
        return this;
    }
}
exports.TwitterApiv2Labs = TwitterApiv2Labs;
exports.default = TwitterApiv2Labs;


/***/ }),

/***/ 5248:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_subclient_1 = __importDefault(__nccwpck_require__(3810));
const globals_1 = __nccwpck_require__(3444);
/**
 * Base Twitter v2 labs client with only read right.
 */
class TwitterApiv2LabsReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_LABS_PREFIX;
    }
}
exports.default = TwitterApiv2LabsReadOnly;


/***/ }),

/***/ 8191:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const globals_1 = __nccwpck_require__(3444);
const client_v2_labs_read_1 = __importDefault(__nccwpck_require__(5248));
/**
 * Base Twitter v2 labs client with read/write rights.
 */
class TwitterApiv2LabsReadWrite extends client_v2_labs_read_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_LABS_PREFIX;
    }
    /**
     * Get a client with only read rights.
     */
    get readOnly() {
        return this;
    }
}
exports.default = TwitterApiv2LabsReadWrite;


/***/ }),

/***/ 4692:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwitterApiv2 = void 0;
const globals_1 = __nccwpck_require__(3444);
const client_v2_write_1 = __importDefault(__nccwpck_require__(5587));
const client_v2_labs_1 = __importDefault(__nccwpck_require__(1204));
/**
 * Twitter v2 client with all rights (read/write/DMs)
 */
class TwitterApiv2 extends client_v2_write_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_PREFIX;
    }
    /* Sub-clients */
    /**
     * Get a client with read/write rights.
     */
    get readWrite() {
        return this;
    }
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs() {
        if (this._labs)
            return this._labs;
        return this._labs = new client_v2_labs_1.default(this);
    }
}
exports.TwitterApiv2 = TwitterApiv2;
exports.default = TwitterApiv2;


/***/ }),

/***/ 7318:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_subclient_1 = __importDefault(__nccwpck_require__(3810));
const globals_1 = __nccwpck_require__(3444);
const paginators_1 = __nccwpck_require__(5814);
const client_v2_labs_read_1 = __importDefault(__nccwpck_require__(5248));
const user_paginator_v2_1 = __nccwpck_require__(2178);
const helpers_1 = __nccwpck_require__(1120);
/**
 * Base Twitter v2 client with only read right.
 */
class TwitterApiv2ReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_PREFIX;
    }
    /* Sub-clients */
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs() {
        if (this._labs)
            return this._labs;
        return this._labs = new client_v2_labs_read_1.default(this);
    }
    /* Tweets */
    /**
     * The recent search endpoint returns Tweets from the last seven days that match a search query.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
     */
    async search(query, options = {}) {
        const queryParams = { ...options, query };
        const initialRq = await this.get('tweets/search/recent', queryParams, { fullResponse: true });
        return new paginators_1.TweetSearchRecentV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * The full-archive search endpoint returns the complete history of public Tweets matching a search query;
     * since the first Tweet was created March 26, 2006.
     *
     * This endpoint is only available to those users who have been approved for the Academic Research product track.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all
     */
    async searchAll(query, options = {}) {
        const queryParams = { ...options, query };
        const initialRq = await this.get('tweets/search/all', queryParams, { fullResponse: true });
        return new paginators_1.TweetSearchAllV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a variety of information about a single Tweet specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id
     *
     * OAuth2 scope: `users.read`, `tweet.read`
     */
    singleTweet(tweetId, options = {}) {
        return this.get('tweets/:id', options, { params: { id: tweetId } });
    }
    /**
     * Returns a variety of information about tweets specified by list of IDs.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets
     *
     * OAuth2 scope: `users.read`, `tweet.read`
     */
    tweets(tweetIds, options = {}) {
        return this.get('tweets', { ids: tweetIds, ...options });
    }
    /**
     * The recent Tweet counts endpoint returns count of Tweets from the last seven days that match a search query.
     * OAuth2 Bearer auth only.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/counts/api-reference/get-tweets-counts-recent
     */
    tweetCountRecent(query, options = {}) {
        return this.get('tweets/counts/recent', { query, ...options });
    }
    /**
     * This endpoint is only available to those users who have been approved for the Academic Research product track.
     * The full-archive search endpoint returns the complete history of public Tweets matching a search query;
     * since the first Tweet was created March 26, 2006.
     * OAuth2 Bearer auth only.
     * **This endpoint has pagination, yet it is not supported by bundled paginators. Use `next_token` to fetch next page.**
     * https://developer.twitter.com/en/docs/twitter-api/tweets/counts/api-reference/get-tweets-counts-all
     */
    tweetCountAll(query, options = {}) {
        return this.get('tweets/counts/all', { query, ...options });
    }
    /**
     * Allows you to get information about who has Retweeted a Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/retweets/api-reference/get-tweets-id-retweeted_by
     */
    tweetRetweetedBy(tweetId, options = {}) {
        return this.get('tweets/:id/retweeted_by', options, { params: { id: tweetId } });
    }
    /**
     * Allows you to get information about who has Liked a Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-tweets-id-liking_users
     */
    tweetLikedBy(tweetId, options = {}) {
        return this.get('tweets/:id/liking_users', options, { params: { id: tweetId } });
    }
    /**
     * Returns Tweets composed by a single user, specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, the most recent 3,200 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
     */
    async userTimeline(userId, options = {}) {
        const initialRq = await this.get('users/:id/tweets', options, {
            fullResponse: true,
            params: { id: userId },
        });
        return new paginators_1.TweetUserTimelineV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: options,
            sharedParams: { id: userId },
        });
    }
    /**
     * Returns Tweets mentioning a single user specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, up to the most recent 800 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions
     */
    async userMentionTimeline(userId, options = {}) {
        const initialRq = await this.get('users/:id/mentions', options, {
            fullResponse: true,
            params: { id: userId },
        });
        return new paginators_1.TweetUserMentionTimelineV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: options,
            sharedParams: { id: userId },
        });
    }
    /* Users */
    /**
     * Returns a variety of information about a single user specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id
     */
    user(userId, options = {}) {
        return this.get('users/:id', options, { params: { id: userId } });
    }
    /**
     * Returns a variety of information about one or more users specified by the requested IDs.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users
     */
    users(userIds, options = {}) {
        const ids = Array.isArray(userIds) ? userIds.join(',') : userIds;
        return this.get('users', { ...options, ids });
    }
    /**
     * Returns a variety of information about a single user specified by their username.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username
     */
    userByUsername(username, options = {}) {
        return this.get('users/by/username/:username', options, { params: { username } });
    }
    /**
     * Returns a variety of information about one or more users specified by their usernames.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by
     *
     * OAuth2 scope: `users.read`, `tweet.read`
     */
    usersByUsernames(usernames, options = {}) {
        usernames = Array.isArray(usernames) ? usernames.join(',') : usernames;
        return this.get('users/by', { ...options, usernames });
    }
    async followers(userId, options = {}) {
        const { asPaginator, ...parameters } = options;
        const params = { id: userId };
        if (!asPaginator) {
            return this.get('users/:id/followers', parameters, { params });
        }
        const initialRq = await this.get('users/:id/followers', parameters, { fullResponse: true, params });
        return new user_paginator_v2_1.UserFollowersV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: parameters,
            sharedParams: params,
        });
    }
    async following(userId, options = {}) {
        const { asPaginator, ...parameters } = options;
        const params = { id: userId };
        if (!asPaginator) {
            return this.get('users/:id/following', parameters, { params });
        }
        const initialRq = await this.get('users/:id/following', parameters, { fullResponse: true, params });
        return new user_paginator_v2_1.UserFollowingV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: parameters,
            sharedParams: params,
        });
    }
    /**
     * Allows you to get information about a user’s liked Tweets.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-users-id-liked_tweets
     */
    async userLikedTweets(userId, options = {}) {
        const params = { id: userId };
        const initialRq = await this.get('users/:id/liked_tweets', options, { fullResponse: true, params });
        return new paginators_1.TweetV2UserLikedTweetsPaginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: { ...options },
            sharedParams: params,
        });
    }
    /**
     * Returns a list of users who are blocked by the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/get-users-blocking
     */
    async userBlockingUsers(userId, options = {}) {
        const params = { id: userId };
        const initialRq = await this.get('users/:id/blocking', options, { fullResponse: true, params });
        return new user_paginator_v2_1.UserBlockingUsersV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: { ...options },
            sharedParams: params,
        });
    }
    /**
     * Returns a list of users who are muted by the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/users/mutes/api-reference/get-users-muting
     */
    async userMutingUsers(options = {}) {
        const { id_str: userId } = await this.getCurrentUserObject();
        const params = { id: userId };
        const initialRq = await this.get('users/:id/muting', options, { fullResponse: true, params });
        return new user_paginator_v2_1.UserMutingUsersV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: { ...options },
            sharedParams: params,
        });
    }
    /* Spaces */
    /**
     * Get a single space by ID.
     * https://developer.twitter.com/en/docs/twitter-api/spaces/lookup/api-reference/get-spaces-id
     *
     * OAuth2 scopes: `tweet.read`, `users.read`, `space.read`.
     */
    space(spaceId, options = {}) {
        return this.get('spaces/:id', options, { params: { id: spaceId } });
    }
    /**
     * Get spaces using their IDs.
     * https://developer.twitter.com/en/docs/twitter-api/spaces/lookup/api-reference/get-spaces
     *
     * OAuth2 scopes: `tweet.read`, `users.read`, `space.read`.
     */
    spaces(spaceIds, options = {}) {
        return this.get('spaces', { ids: spaceIds, ...options });
    }
    /**
     * Get spaces using their creator user ID(s). (no pagination available)
     * https://developer.twitter.com/en/docs/twitter-api/spaces/lookup/api-reference/get-spaces-by-creator-ids
     *
     * OAuth2 scopes: `tweet.read`, `users.read`, `space.read`.
     */
    spacesByCreators(creatorIds, options = {}) {
        return this.get('spaces/by/creator_ids', { user_ids: creatorIds, ...options });
    }
    /**
     * Search through spaces using multiple params. (no pagination available)
     * https://developer.twitter.com/en/docs/twitter-api/spaces/search/api-reference/get-spaces-search
     */
    searchSpaces(options) {
        return this.get('spaces/search', options);
    }
    searchStream({ autoConnect, ...options } = {}) {
        return this.getStream('tweets/search/stream', options, { payloadIsError: helpers_1.isTweetStreamV2ErrorPayload, autoConnect });
    }
    /**
     * Return a list of rules currently active on the streaming endpoint, either as a list or individually.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream-rules
     */
    streamRules(options = {}) {
        return this.get('tweets/search/stream/rules', options);
    }
    updateStreamRules(options, query = {}) {
        return this.post('tweets/search/stream/rules', options, { query });
    }
    sampleStream({ autoConnect, ...options } = {}) {
        return this.getStream('tweets/sample/stream', options, { payloadIsError: helpers_1.isTweetStreamV2ErrorPayload, autoConnect });
    }
    /* Batch compliance */
    /**
     * Returns a list of recent compliance jobs.
     * https://developer.twitter.com/en/docs/twitter-api/compliance/batch-compliance/api-reference/get-compliance-jobs
     */
    complianceJobs(options) {
        return this.get('compliance/jobs', options);
    }
    /**
     * Get a single compliance job with the specified ID.
     * https://developer.twitter.com/en/docs/twitter-api/compliance/batch-compliance/api-reference/get-compliance-jobs-id
     */
    complianceJob(jobId) {
        return this.get('compliance/jobs/:id', undefined, { params: { id: jobId } });
    }
    /**
     * Creates a new compliance job for Tweet IDs or user IDs, send your file, await result and parse it into an array.
     * You can run one batch job at a time. Returns the created job, but **not the job result!**.
     *
     * You can obtain the result (**after job is completed**) with `.complianceJobResult`.
     * https://developer.twitter.com/en/docs/twitter-api/compliance/batch-compliance/api-reference/post-compliance-jobs
     */
    async sendComplianceJob(jobParams) {
        const job = await this.post('compliance/jobs', { type: jobParams.type, name: jobParams.name });
        // Send the IDs
        const rawIdsBody = jobParams.ids instanceof Buffer ? jobParams.ids : Buffer.from(jobParams.ids.join('\n'));
        // Upload the IDs
        await this.put(job.data.upload_url, rawIdsBody, {
            forceBodyMode: 'raw',
            enableAuth: false,
            headers: { 'Content-Type': 'text/plain' },
            prefix: '',
        });
        return job;
    }
    /**
     * Get the result of a running or completed job, obtained through `.complianceJob`, `.complianceJobs` or `.sendComplianceJob`.
     * If job is still running (`in_progress`), it will await until job is completed. **This could be quite long!**
     * https://developer.twitter.com/en/docs/twitter-api/compliance/batch-compliance/api-reference/post-compliance-jobs
     */
    async complianceJobResult(job) {
        let runningJob = job;
        while (runningJob.status !== 'complete') {
            if (runningJob.status === 'expired' || runningJob.status === 'failed') {
                throw new Error('Job failed to be completed.');
            }
            await new Promise(resolve => setTimeout(resolve, 3500));
            runningJob = (await this.complianceJob(job.id)).data;
        }
        // Download and parse result
        const result = await this.get(job.download_url, undefined, {
            enableAuth: false,
            prefix: '',
        });
        return result
            .trim()
            .split('\n')
            .filter(line => line)
            .map(line => JSON.parse(line));
    }
}
exports.default = TwitterApiv2ReadOnly;


/***/ }),

/***/ 5587:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const globals_1 = __nccwpck_require__(3444);
const client_v2_read_1 = __importDefault(__nccwpck_require__(7318));
const client_v2_labs_write_1 = __importDefault(__nccwpck_require__(8191));
/**
 * Base Twitter v2 client with read/write rights.
 */
class TwitterApiv2ReadWrite extends client_v2_read_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_PREFIX;
    }
    /* Sub-clients */
    /**
     * Get a client with only read rights.
     */
    get readOnly() {
        return this;
    }
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs() {
        if (this._labs)
            return this._labs;
        return this._labs = new client_v2_labs_write_1.default(this);
    }
    /* Tweets */
    /**
     * Hides or unhides a reply to a Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/hide-replies/api-reference/put-tweets-id-hidden
     */
    hideReply(tweetId, makeHidden) {
        return this.put('tweets/:id/hidden', { hidden: makeHidden }, { params: { id: tweetId } });
    }
    /**
     * Causes the user ID identified in the path parameter to Like the target Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/post-users-user_id-likes
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    like(loggedUserId, targetTweetId) {
        return this.post('users/:id/likes', { tweet_id: targetTweetId }, { params: { id: loggedUserId } });
    }
    /**
     * Allows a user or authenticated user ID to unlike a Tweet.
     * The request succeeds with no action when the user sends a request to a user they're not liking the Tweet or have already unliked the Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-id-likes-tweet_id
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unlike(loggedUserId, targetTweetId) {
        return this.delete('users/:id/likes/:tweet_id', undefined, {
            params: { id: loggedUserId, tweet_id: targetTweetId },
        });
    }
    /**
     * Causes the user ID identified in the path parameter to Retweet the target Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/retweets/api-reference/post-users-id-retweets
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    retweet(loggedUserId, targetTweetId) {
        return this.post('users/:id/retweets', { tweet_id: targetTweetId }, { params: { id: loggedUserId } });
    }
    /**
     * Allows a user or authenticated user ID to remove the Retweet of a Tweet.
     * The request succeeds with no action when the user sends a request to a user they're not Retweeting the Tweet or have already removed the Retweet of.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/retweets/api-reference/delete-users-id-retweets-tweet_id
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unretweet(loggedUserId, targetTweetId) {
        return this.delete('users/:id/retweets/:tweet_id', undefined, {
            params: { id: loggedUserId, tweet_id: targetTweetId },
        });
    }
    /* Users */
    /**
     * Allows a user ID to follow another user.
     * If the target user does not have public Tweets, this endpoint will send a follow request.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/post-users-source_user_id-following
     *
     * OAuth2 scope: `account.follows.write`
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    follow(loggedUserId, targetUserId) {
        return this.post('users/:id/following', { target_user_id: targetUserId }, { params: { id: loggedUserId } });
    }
    /**
     * Allows a user ID to unfollow another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/delete-users-source_id-following
     *
     * OAuth2 scope: `account.follows.write`
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unfollow(loggedUserId, targetUserId) {
        return this.delete('users/:source_user_id/following/:target_user_id', undefined, {
            params: { source_user_id: loggedUserId, target_user_id: targetUserId },
        });
    }
    /**
     * Causes the user (in the path) to block the target user.
     * The user (in the path) must match the user context authorizing the request.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/post-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    block(loggedUserId, targetUserId) {
        return this.post('users/:id/blocking', { target_user_id: targetUserId }, { params: { id: loggedUserId } });
    }
    /**
     * Allows a user or authenticated user ID to unblock another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/delete-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unblock(loggedUserId, targetUserId) {
        return this.delete('users/:source_user_id/blocking/:target_user_id', undefined, {
            params: { source_user_id: loggedUserId, target_user_id: targetUserId },
        });
    }
    /**
     * Allows an authenticated user ID to mute the target user.
     * https://developer.twitter.com/en/docs/twitter-api/users/mutes/api-reference/post-users-user_id-muting
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    mute(loggedUserId, targetUserId) {
        return this.post('users/:id/muting', { target_user_id: targetUserId }, { params: { id: loggedUserId } });
    }
    /**
     * Allows an authenticated user ID to unmute the target user.
     * The request succeeds with no action when the user sends a request to a user they're not muting or have already unmuted.
     * https://developer.twitter.com/en/docs/twitter-api/users/mutes/api-reference/delete-users-user_id-muting
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unmute(loggedUserId, targetUserId) {
        return this.delete('users/:source_user_id/muting/:target_user_id', undefined, {
            params: { source_user_id: loggedUserId, target_user_id: targetUserId },
        });
    }
    /* Lists */
    /**
     * Creates a new list for the authenticated user.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/post-lists
     */
    createList(options) {
        return this.post('lists', options);
    }
    /**
     * Updates the specified list. The authenticated user must own the list to be able to update it.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/put-lists-id
     */
    updateList(listId, options = {}) {
        return this.put('lists/:id', options, { params: { id: listId } });
    }
    /**
     * Deletes the specified list. The authenticated user must own the list to be able to destroy it.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/delete-lists-id
     */
    removeList(listId) {
        return this.delete('lists/:id', undefined, { params: { id: listId } });
    }
    /**
     * Adds a member to a list.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/post-lists-id-members
     */
    addListMember(listId, userId) {
        return this.post('lists/:id/members', { user_id: userId }, { params: { id: listId } });
    }
    /**
     * Remember a member to a list.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/delete-lists-id-members-user_id
     */
    removeListMember(listId, userId) {
        return this.delete('lists/:id/members/:user_id', undefined, { params: { id: listId, user_id: userId } });
    }
    /**
     * Subscribes the authenticated user to the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/post-users-id-followed-lists
     */
    subscribeToList(loggedUserId, listId) {
        return this.post('users/:id/followed_lists', { list_id: listId }, { params: { id: loggedUserId } });
    }
    /**
     * Unsubscribes the authenticated user to the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/delete-users-id-followed-lists-list_id
     */
    unsubscribeOfList(loggedUserId, listId) {
        return this.delete('users/:id/followed_lists/:list_id', undefined, { params: { id: loggedUserId, list_id: listId } });
    }
    /**
     * Enables the authenticated user to pin a List.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/post-users-id-pinned-lists
     */
    pinList(loggedUserId, listId) {
        return this.post('users/:id/pinned_lists', { list_id: listId }, { params: { id: loggedUserId } });
    }
    /**
     * Enables the authenticated user to unpin a List.
     * https://developer.twitter.com/en/docs/twitter-api/lists/manage-lists/api-reference/delete-users-id-pinned-lists-list_id
     */
    unpinList(loggedUserId, listId) {
        return this.delete('users/:id/pinned_lists/:list_id', undefined, { params: { id: loggedUserId, list_id: listId } });
    }
}
exports.default = TwitterApiv2ReadWrite;


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";


const core = __nccwpck_require__(2186)
const { TwitterApi } = __nccwpck_require__(9360)

// most @actions toolkit packages have async methods
async function run () {
  try {
    const tweet = getInput('tweet-message', { mandatory: true })

    const tweetLength = getInput('length', { defaultValue: 280 })
    if (tweet.length > tweetLength) {
      throw new Error(`Tweet is too long. Max length is ${tweetLength}`)
    }

    const consumerKey = getEnv('TWITTER_CONSUMER_API_KEY', { mandatory: true })
    const consumerSecret = getEnv('TWITTER_CONSUMER_API_SECRET', { mandatory: true })
    const accessToken = getEnv('TWITTER_ACCESS_TOKEN', { mandatory: false })
    const accessTokenSecret = getEnv('TWITTER_ACCESS_TOKEN_SECRET', { mandatory: false })

    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret
    })

    const response = await client.v2.post('tweets', {
      text: tweet
    })
    console.log(response)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

function getInput (name, { mandatory, defaultValue } = {}) {
  const input = core.getInput(name) || defaultValue
  if (!input && mandatory === true) {
    throw new Error(`${name} is a required input`)
  }
  return input
}

function getEnv (name, { mandatory, defaultValue } = {}) {
  const env = process.env[name]
  if (!env && mandatory === true) {
    throw new Error(`${name} is a required environment variable`)
  }
  return env
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map