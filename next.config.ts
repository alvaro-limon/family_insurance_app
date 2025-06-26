import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: 'export',
	
	images: {
		unoptimized: true,
	},
	// Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
	trailingSlash: true,
	basePath: '/family/insurance/app'
}
 
module.exports = nextConfig
