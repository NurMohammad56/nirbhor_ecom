import type {NextConfig} from 'next';
const config:NextConfig={output:'standalone',outputFileTracingRoot:process.cwd(),images:{unoptimized:true},poweredByHeader:false,reactStrictMode:true,devIndicators:false,experimental:{cpus:2}};
export default config;
