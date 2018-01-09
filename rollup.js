/**
 * @module rollup
 * @license MIT
 * @version 2018/01/09
 */

'use strict';

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-es');
const pkg = require('./package.json');

const banner = `/**
 * @module ${pkg.name}
 * @author ${pkg.author.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

rollup
  .rollup({
    input: 'src/video.js'
  })
  .then(function(bundle) {
    try {
      fs.statSync('dist');
    } catch (e) {
      // no such file or directory
      fs.mkdirSync('dist');
    }

    bundle
      .generate({
        name: 'Video',
        format: 'umd',
        strict: true,
        indent: true,
        banner: banner,
        amd: { id: 'video' }
      })
      .then(function(result) {
        const src = 'dist/video.js';
        const map = 'viewport.js.map';
        const min = 'dist/video.min.js';

        fs.writeFileSync(src, result.code);
        console.log(`  Build ${src} success!`);

        result = uglify.minify(
          {
            'video.js': result.code
          },
          {
            ecma: 5,
            ie8: true,
            mangle: { eval: true },
            sourceMap: { url: map }
          }
        );

        fs.writeFileSync(min, banner + result.code);
        console.log(`  Build ${min} success!`);
        fs.writeFileSync(src + '.map', result.map);
        console.log(`  Build ${src + '.map'} success!`);
      })
      .catch(function(error) {
        console.error(error);
      });
  })
  .catch(function(error) {
    console.error(error);
  });
