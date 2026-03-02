import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-math"]],
    rehypePlugins: [["rehype-katex"]],
  },
});

const nextConfig = {
  turbopack: {},
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      new URL("https://assets.tailwindcss.com/templates/compass/**"),
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  serverExternalPackages: ["@supabase/ssr", "@supabase/supabase-js"],
};

export default withMDX(nextConfig);
