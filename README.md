🔧 Get started
### 1. Install Webpack

We use npm: <code>$ npm init</code> command to create a package.json file in a project folder where we will put our JavaScript dependencies. <br/><br/>Then we can install Webpack itself with <br/><code>$ npm i --save-dev webpack webpack-cli</code>.
### 2. Create entry point file

Webpack starts its job from a single JavaScript file, which is called the entry point. Create <code>index.js</code> in the javascript folder. You can write some simple code here like console.log('Hi') to ensure it works.

### 3. Create webpack.config.js

... in the project folder. Here is where all ✨ magic happens.

// Webpack uses this to work with directories
<br/>```const path = require('path');```

// This is the main configuration object.<br/>
// Here, you write different options and tell Webpack what to do
<br/>
```module.exports = {

  // Path to your entry point. From this file Webpack will begin its work
  entry: './src/javascript/index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on the final bundle. For now, we don't need production's JavaScript 
  // minifying and other things, so let's set mode to development
  mode: 'development'
};
```

### 4. Add npm script in package.json to run Webpack

To run Webpack, we have to use npm script with simple command webpack and our configuration file as config option. Our <code>package.json</code> should look like this for now:
```
{
  "scripts": {
    "build": "webpack --config webpack.config.js"
  },
  "devDependencies": {
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  }
}
```
### 5. Run Webpack

With that basic setup, you can run $ npm run build command. Webpack will look up our entry file, resolve all import module dependencies inside it and bundle it into single .js file in dist folder. In the console, you should see something like this:

If you add `<script src="dist/bundle.js"></script>` into yout HTML file you should see Hi in a browser console!
🔬 Loaders

Great! We have standard JavaScript bundled. But what if we want to use all cool features from ES6 (and beyond) and preserve browser compatibility? How should we tell Webpack to transform (transpile) our ES6 code to browser-compatible code?

That is where Webpack loaders come into play. Loaders are one of the main features of Webpack. They apply certain transformations to our code.

Let's add to <code>webpack.config.js</code> file new option module.rules. In this option, we will say Webpack how exactly it should transform different types of files.

```entry: /* ... */,
output: /* ... */,

module: {
  rules: [
  ]
}
```
For JavaScript files, we will use:
### 1. babel-loader

Babel is currently the best JavaScript transpiler out there. We will tell Webpack to use it to transform our modern JavaScript code to browser-compatible JavaScript code before bundling it.

Babel-loader does exactly that. Let's install it:
`$ npm i --save-dev babel-loader @babel/core @babel/preset-env`

Now we are going to add rule about JavaScript files:
```rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
]
```
<br/>
    test is a regular expression for file extension which we are going to transform. In our case, it's JavaScript files.
    exclude is a regular expression that tells Webpack which path should be ignored when transforming modules. That means we won't convert imported vendor libraries from npm if we import them in the future.
    use is the main rule's option. Here we set loader, which is going to be applied to files that correspond to test regexp (JavaScript files in this case)
    options can vary depending on the loader. In this case, we set default presets for Babel to consider which ES6 features it should transform and which not. It is a separate topic on its own, and you can dive into it if you are interested, but it's safe to keep it like this for now.

Now you can place ES6 code inside your JavaScript modules safely!
### 2. sass-loader

Time to work with styles. Usually, we don't want to write plain CSS. Very often, we use SASS preprocessor. We transform SASS to CSS and then apply auto prefixing and minifying. It's a kind of "default" approach to CSS. Let's tell Webpack to do exactly that.

Let's say we import our main SASS file sass/styles.scss in our <code>javascripts/index.js</code> entry point.

`import '../sass/styles.scss';`

But for now, Webpack has no idea how to handle .scss files or any files except .js. We need to add proper loaders so Webpack could resolve those files:
`$ npm i --save-dev sass sass-loader postcss-loader css-loader`

We can add a new rule for SASS files and tell Webpack what to do with them:
```
rules: [
    {
      test: /\.js$/,
      /* ... */
    },
    {
      // Apply rule for .sass, .scss or .css files
      test: /\.(sa|sc|c)ss$/,

      // Set loaders to transform files.
      // Loaders are applying from right to left(!)
      // The first loader will be applied after others
      use: [
             {
               // This loader resolves url() and @imports inside CSS
               loader: "css-loader",
             },
             {
               // Then we apply postCSS fixes like autoprefixer and minifying
               loader: "postcss-loader"
             },
             {
               // First we transform SASS to standard CSS
               loader: "sass-loader"
               options: {
                 implementation: require("sass")
               }
             }
           ]
    }
]
```

Note important thing about Webpack here. It can chain multiple loaders; they will be applied one by one from last to the first in the use array.

Now when Webpack meets `import 'file.scss';` in code, it knows what to do!
PostCSS

How should we tell to postcss-loader which transformations it must apply? We create a separate config file <code>postcss.config.js</code> and use postcss plugins that we need for our styles. You may found minifying and autoprefixing the most basic and useful plugins to make sure CSS is ready for your real web site.

First, install those postcss plugins: `$ npm i --save-dev autoprefixer cssnano`.

Second, add them to postcss.config.js file like that:
```
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano'),
        // More postCSS modules here if needed
    ]
}
```
You can dive into PostCSS deeper and find more plugins that suit your workflow or project requirement.

After all that CSS setup only one thing left. Webpack will resolve your .scss imports, transform them, and... What's next? It won't magically create a single .css file with your styles bundled; we have to tell Webpack to do that. But this task is out of loaders' capabilities. We have to use Webpack's plugin for that.

##🔌 Plugins

Their purpose is to do anything else that loaders can't. If we need to extract all that transformed CSS into a separate "bundle" file, we have to use a plugin. And there is a special one for our case: MiniCssExtractPlugin:
`$ npm i --save-dev mini-css-extract-plugin`

We can import plugins separately right at the start of the <code>webpack.config.js</code> file:

`const MiniCssExtractPlugin = require("mini-css-extract-plugin");`

After our module.rules array where we set loaders add new plugins code where we activate our plugins with options:
```
module: {
  rules: [
    /* ... */
  ]
},
plugins: [

  new MiniCssExtractPlugin({
    filename: "bundle.css"
  })

]
```
Now we can chain this plugin into our CSS loaders:
```
{
      test: /\.(sa|sc|c)ss$/,
      use: [
             {
               // After all CSS loaders, we use a plugin to do its work.
               // It gets all transformed CSS and extracts it into separate
               // single bundled file
               loader: MiniCssExtractPlugin.loader
             }, 
             {
               loader: "css-loader",
             },
             /* ... Other loaders ... */
           ]
}
```
Done! If you followed along, you could run $ npm run build command and find <code>bundle.css</code> file in your dist folder. General setup now should look like this:

Webpack has tons of plugins for different purposes. You can explore them at your need in official documentation.
###🔬 More loaders: images and fonts

At this point, you should catch up on the basics of how Webpack works. But we are not done yet. Most websites need some assets: images and fonts that we set through our CSS. Webpack can resolve background-image: url(...) line thanks to css-loader, but it has no idea what to do if you set URL to .png or jpg file.

We need a new loader to handle files inside CSS or to be able to import them right in JavaScript. And here it is:
### file-loader

Install it with $ npm i --save-dev file-loader and add a new rule to our webpack.config.js:
```
rules: [
    {
      test: /\.js$/,
      /* ... */
    },
    {
      test: /\.(sa|sc|c)ss$/,
      /* ... */
    },
    {
      // Now we apply rule for images
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [
             {
               // Using file-loader for these files
               loader: "file-loader",

               // In options we can set different things like format
               // and directory to save
               options: {
                 outputPath: 'images'
               }
             }
           ]
    }
]
```
Now if you use inside your CSS some image like this:
```
body {
  background-image: url('../images/cat.jpg');
}
```
Webpack will resolve it successfully. You will find your image with a hashed name inside dist/images folder. And inside bundle.css you will find something like this:
```
body {
  background-image: url(images/e1d5874c81ec7d690e1de0cadb0d3b8b.jpg);
}
```
As you can see, Webpack is very intelligent — it correctly resolves the path of your url relatively to the dist folder!

You can as well add a rule for fonts and resolve them similarly to images; change outputPath to fonts folder for consistency:
```
rules: [
    {
      test: /\.js$/,
      /* ... */
    },
    {
      test: /\.(sa|sc|c)ss$/,
      /* ... */
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      /* ... */
    },
    {
      // Apply rule for fonts files
      test: /\.(woff|woff2|ttf|otf|eot)$/,
      use: [
             {
               // Using file-loader too
               loader: "file-loader",
               options: {
                 outputPath: 'fonts'
               }
             }
           ]
    }
]
```
###🏆 Wrapping up

That's it! A simple Webpack configuration for a classic website. We covered the concepts of entry point, loaders, and plugins and how Webpack transforms and bundles your files.
