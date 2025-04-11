module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your image domains if needed
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ttf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        },
      ],
    });
    return config;
  },
};