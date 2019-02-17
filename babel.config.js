module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				useBuiltIns: "usage"
			}
		]
	],
	env: {
		test: {
			plugins: ["istanbul"]
		}
	}
};
