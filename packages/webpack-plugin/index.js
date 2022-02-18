const { ProvidePlugin } = require("webpack");
const filterObject = require("filter-obj");

const excludeObjectKeys = (object, excludeKeys) => filterObject(object, key => !excludeKeys.includes(key));

module.exports = class OpenharmonyPolyfillPlugin {
	constructor(options = {}) {
		this.options = {
			excludeAliases: [],
			...options
		};
	}

	apply(compiler) {
		compiler.options.plugins.push(new ProvidePlugin(excludeObjectKeys({
			Buffer: [require.resolve("buffer/"), "Buffer"],
			process: require.resolve("process/browser"),
			fetch: ['openharmony-polyfill/web/fetch', 'fetch'],
			XMLHttpRequest: ['openharmony-polyfill/web/xhr', 'XMLHttpRequest']
		}, this.options.excludeAliases)));

		compiler.options.resolve.fallback = {
			...excludeObjectKeys({
				// use openharmony polyfill
				fs: require.resolve("openharmony-polyfill/node/fs"),
				// use browserify
				assert: require.resolve("assert/"),
				buffer: require.resolve("buffer/"),
				domain: require.resolve("domain-browser"),
				events: require.resolve("events/"),
				os: require.resolve("os-browserify/browser"),
				path: require.resolve("path-browserify"),
				process: require.resolve("process/browser"),
				querystring: require.resolve("querystring-es3"),
				stream: require.resolve("stream-browserify"),
				string_decoder: require.resolve("string_decoder/"),
				sys: require.resolve("util/"),
				util: require.resolve("util/")
			}, this.options.excludeAliases),
			...compiler.options.resolve.fallback
		};
	}
};