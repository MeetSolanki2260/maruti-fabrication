import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const config = { output: "export", trailingSlash: true, images: { unoptimized: true }, poweredByHeader: false, reactStrictMode: true };
export default withNextIntl(config);
