module.exports = {
	preset: [
		[
			"@babel/preset-env",
			{
				useBuiltIns: "usage"
			}
		]
	],
	plugins: ["@babel/plugin-proposal-optional-chaining"],
	env: {
		test: {
			plugins: ["istanbul"]
		}
	}
};
