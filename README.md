# Choosing a testing package

I need to choose a testing package is:

- Easy to setup

- Can work exclusively with Typescript files and extensions

- Works within a `.devcontainer`[*](#)

## The options

For web page testing I will be looking into [`playwrite`](https://playwright.dev/) as I want to be abel to test javascript client end projects easier.

For testing comupation & algorithms, options include [`jest`](https://jestjs.io/), [`mocha`](https://mochajs.org/), [`jasmine`](https://jasmine.github.io/) & [`tape`](https://github.com/substack/tape). NOt got a preference on eitehr just yet but something that can give a similar experience to [testing in Go](https://go.dev/doc/tutorial/add-a-test#:~:text=At%20the%20command%20line%20in,the%20tests%20and%20their%20results.) would be ideal.

The idea is that I create my library within the experiemntal directory `src-x`, then once I am satisfied through tests that it works, the package will be moved to the main `src` directory