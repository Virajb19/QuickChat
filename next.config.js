/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
        {
            hostname: "avatars.githubusercontent.com"
        }, 
        {
            hostname: "lh3.googleusercontent.com"
        }
    ]
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    reactStrictMode: false
};

export default config;