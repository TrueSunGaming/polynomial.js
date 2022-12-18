# polynomial.js

Visit the [wiki](https://github.com/TrueSunGaming/polynomial.js/wiki) for more information!

An algebra library by TrueSunGaming.

Includes the classes `Expression` and `Equation` to organize polynomials.

Can also solve linear and quadratic equations.

## Usage

Add to HTML after downloading
```html
<script src="polynomial.js"></script>
```

Create expression 18 + 20x + 2x<sup>2</sup>
```js
const expr = new Expression([18, 20, 2]);
```

Create equation 18 + 21x + 5x<sup>2</sup> = x + 3x<sup>2</sup>, print to console and solve
```js
const eq = new Equation(
  new Expression([18, 21, 5]),
  new Expression([0, 1, 3])
);

console.log(eq.str);
console.log(eq.solutions);
```
Expected output:
```
18 + 21x + 5x^2 = x + 3x^2
[ -1, -9, 2 ]
```
Where -1 is the first solution, -9 is the second, and 2 is the number of solutions that the equation has.
