import { resolve as _resolve } from 'path';

export const entry = '.';
export const target = 'node';
export const module = {
  rules: [
    {
      test: /\.ts$/,
      use: 'ts-loader',
    },
  ],
};
export const resolve = {
  extensions: ['.ts', '.js'],
};
export const output = {
  path: _resolve(__dirname, 'dist'),
  filename: 'main.js',
  libraryTarget: 'commonjs2',
};
export const externalsPresets = { node: true };
