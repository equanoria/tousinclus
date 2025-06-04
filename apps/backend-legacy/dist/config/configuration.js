"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEnv = void 0;
const node_fs_1 = require("node:fs");
const yaml = require("js-yaml");
const node_path_1 = require("node:path");
const types_1 = require("@tousinclus/types");
const isValidNodeEnv = (value) => {
    return Object.values(types_1.ENodeEnv).includes(value);
};
const setupEnv = () => {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv && isValidNodeEnv(nodeEnv))
        return;
    process.env.NODE_ENV = types_1.ENodeEnv.DEVELOPMENT;
    console.warn(`Invalid or missing NODE_ENV value: ${nodeEnv}. Defaulting to 'development'.`);
};
exports.setupEnv = setupEnv;
const getConfigFile = () => {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    return `config.${process.env.NODE_ENV}.yaml`;
};
exports.default = () => {
    try {
        (0, exports.setupEnv)();
        const configFilePath = (0, node_path_1.join)(__dirname, getConfigFile());
        return yaml.load((0, node_fs_1.readFileSync)(configFilePath, 'utf8'));
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to load configuration');
    }
};
//# sourceMappingURL=configuration.js.map