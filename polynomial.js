/**
 * An algebraic expression with whole number exponents.
 */
class Expression {
    /**
     * An expression representing zero.
     */
    static ZERO = new Expression([0]);
    /**
     * An expression representing one.
     */
    static ONE = new Expression([1]);
    /**
     * An expression representing the variable x.
     */
    static X = new Expression([0, 1]);

    /**
     * Parts of an expression in the form a+bx+cx^2+...
     */
    parts = [0];

    /**
     * An algebraic expression with whole number exponents.
     * @param {number[]} parts Parts of an expression in the form a+bx+cx^2+...
     */
    constructor(parts = [0]) {
        this.parts = parts;
    }

    /**
     * Copies an expression
     * @returns {Expression} a clone of the expression.
     */
    get copy() {
        return new Expression(this.parts);
    }

    /**
     * Creates an expression with one term.
     * @param {number} coef Coefficient
     * @param {number} pow Power of x
     * @returns {Expression} the generated expression.
     */
    static single(coef = 0, pow = 0) {
        const p = [];
        for (let i = 0; i < pow; i++) p.push(0);
        p.push(coef);
        return new Expression(p);
    }

    /**
     * Converts an expression to a string.
     * @returns {string} the resulting string.
     */
    toString() {
        var str = "";
        for (let i = 0; i < this.parts.length; i++) if (this.parts[i] != 0 || this.parts.length == 1) str += `${this.parts[i] == 1 && i != 0 ? "" : this.parts[i]}${i == 0 ? "" : `x${i == 1 ? "" : `^${i}`}`}${(i != this.parts.length - 1) ? " + " : ""}`;
        return str;
    }

    /**
     * Same as toString but as a getter.
     * 
     * Converts an expression to a string.
     * @returns {string} the resulting string.
     */
    get str() {
        return this.toString();
    }

    /**
     * Converts an expression to a string of HTML.
     * @returns {string} a string of HTML elements.
     */
    toHTML() {
        var str = "";
        for (let i = 0; i < this.parts.length; i++) if (this.parts[i] != 0) str += `${this.parts[i] == 1 && i != 0 ? "" : this.parts[i]}${i == 0 ? "" : `x${i == 1 ? "" : `<sup>${i}</sup>`}`}${(i != this.parts.length - 1) ? " + " : ""}`;
        return str;
    }

    /**
     * Same as toHTML but as a getter.
     * 
     * Converts an expression to a string of HTML.
     * @returns {string} a string of HTML elements.
     */
    get html() {
        return this.toHTML();
    }

    /**
     * Adds an expression to the current expression.
     * @param {Expression} expr The expression to add.
     * @returns {Expression} the resulting expression.
     */
    add(expr = new Expression()) {
        if (this.parts.length < expr.parts.length) for (let i = this.parts.length; i < expr.parts.length; i++) this.parts.push(0);
        for (let i = 0; i < expr.parts.length; i++) this.parts[i] += expr.parts[i];
        return this;
    }

    /**
     * Subtracts an expression to the current expression.
     * @param {Expression} expr The expression to subtract.
     * @returns {Expression} the resulting expression.
     */
    sub(expr = new Expression()) {
        if (this.parts.length < expr.parts.length) for (let i = this.parts.length; i < expr.parts.length; i++) this.parts.push(0);
        for (let i = 0; i < expr.parts.length; i++) this.parts[i] -= expr.parts[i];
        return this;
    }

    /**
     * Multiplies the expression by a monomial.
     * 
     * Warning: Any negative exponents will be removed.
     * @param {number} coef The coefficient of the monomial.
     * @param {number} pow The exponent of x in the monomial.
     * @returns {Expression} the resulting expression.
     */
    multSingle(coef = 0, pow = 0) {
        const res = new Expression();
        for (let i = 0; i < this.parts.length; i++) if (i + pow >= 0) res.add(Expression.single(this.parts[i] * coef, i + pow));
        this.parts = res.parts;
        return this;
    }

    /**
     * Divides the expression by a monomial.
     * 
     * Warning: Any negative exponents will be removed.
     * @param {number} coef The coefficient of the monomial.
     * @param {number} pow The exponent of x in the monomial.
     * @returns {Expression} the resulting expression.
     */
    divSingle(coef = 0, pow = 0) {
        return this.multSingle(1 / coef, -pow);
    }

    /**
     * Multiplies the expression by another expression.
     * @param {Expression} expr The expression to multiply by.
     * @returns {Expression} the resulting expression.
     */
    mult(expr = new Expression()) {
        const res = new Expression();
        for (let i = 0; i < expr.parts.length; i++) res.add(this.copy.multSingle(expr.parts[i], i));
        this.parts = res.parts;
        return this;
    }

    /**
     * Divides the expression by another expression.
     * @param {Expression} expr The expression to divide by.
     * @returns {Expression} the resulting expression.
     */
    div(expr = new Expression()) {
        const res = new Expression();
        for (let i = 0; i < expr.parts.length; i++) res.add(this.copy.divSingle(expr.parts[i], i));
        this.parts = res.parts;
        return this;
    }

    /**
     * Returns true if the expression is equal to another expression.
     * @param {Expression} expr The expression to check equality with.
     * @returns {boolean} whether or not the two expressions are equal.
     */
    equal(expr = new Expression()) {
        var equal = true;
        for (let i = 0; i < Math.max(this.parts.length, expr.parts.length); i++) equal &&= (this.parts[i] ?? 0) == (expr.parts[i] ?? 0);
        return equal;
    }

    /**
     * Removes any zeros past the last term in the expression.
     * @returns {Expression} The trimmed expression.
     */
    trim() {
        while(this.parts[this.parts.length - 1] == 0 && this.parts.length > 1) this.parts.splice(this.parts.length - 1, 1);
        return this;
    }

    /**
     * Exponentiates the expression to a whole number power.
     * @param {number} pow A whole number to exponentiate the expression to.
     * @returns {Expression} the resulting expression.
     */
    pow(pow = 1) {
        if (pow % 1 != 0 || pow < 0) return this;
        var res = Expression.ONE.copy;
        for (let i = 0; i < pow; i++) res.mult(this);
        this.parts = res.parts;
        return this;
    }
}

/**
 * An equation with two sides.
 */
class Equation {
    /**
     * The left side of the equation.
     */
    left = new Expression();

    /**
     * The right side of the equation.
     */
    right = new Expression();

    /**
     * An equation with two sides.
     * @param {Expression} left The left side of the equation.
     * @param {Expression} right The right side of the equation
     */
    constructor(left = new Expression(), right = new Expression()) {
        this.left = left.copy.trim();
        this.right = right.copy.trim();
    }

    /**
     * Creates a clone of the equation.
     * @returns {Equation} the copy.
     */
    get copy() {
        return new Equation(this.left.copy, this.right.copy);
    }

    /**
     * Converts the equation to a string.
     * @returns {string} the resulting string.
     */
    toString() {
        return `${this.left.toString()} = ${this.right.toString()}`;
    }

    /**
     * Same as toString but as a getter.
     * 
     * Converts the equation to a string.
     * @returns {string} the resulting string.
     */
    get str() {
        return this.toString();
    }

    /**
     * Converts the equation into a string of HTML elements.
     * @returns {string} the resulting string of HTML.
     */
    toHTML() {
        return `${this.left.toHTML()} = ${this.right.toHTML()}`;
    }

    /**
     * Same as toHTML but as a getter.
     * 
     * Converts the equation into a string of HTML elements.
     * @returns {string} the resulting string of HTML.
     */
    get html() {
        return this.toHTML();
    }

    /**
     * Returns whether or not the equation can be solved by the library.
     * 
     * The library can only solve linears and quadratics with real number solution(s).
     * @returns {boolean} whether it can be solved.
     */
    get solveable() {
        return this.left.parts.length < 4 && this.right.parts.length < 4 && !this.infiniteSolutions;
    }

    /**
     * Checks if the equation has infinite solutions.
     * @returns {boolean} whether or not the equation has infinite solutions.
     */
    get infiniteSolutions() {
        return this.left.equal(this.right);
    }

    /**
     * Adds an expression to both sides of the equation.
     * @param {Expression} expr The expression to add.
     * @returns {Equation} the resulting equation.
     */
    add(expr = new Expression()) {
        this.left.add(expr).trim();
        this.right.add(expr).trim();
        return this;
    }

    /**
     * Subtracts an expression from both sides of the equation.
     * @param {Expression} expr The expression to subtract.
     * @returns {Equation} the resulting equation.
     */
    sub(expr = new Expression()) {
        this.left.sub(expr).trim();
        this.right.sub(expr).trim();
        return this;
    }

    /**
     * Mutliplies both sides of the equation by an expression.
     * 
     * Warning: Any negative exponents will be removed.
     * @param {Expression} expr The expression to multiply by.
     * @returns the resulting expression.
     */
    mult(expr = new Expression()) {
        this.left.mult(expr).trim();
        this.right.mult(expr).trim();
        return this;
    }

    /**
     * Divides both sides of the equation by an expression.
     * 
     * Warning: Any negative exponents will be removed.
     * @param {Expression} expr The expression to divide by.
     * @returns the resulting expression.
     */
    div(expr = new Expression()) {
        this.left.div(expr).trim();
        this.right.div(expr).trim();
        return this;
    }

    /**
     * Exponentiates both sides of the equation to a whole number power.
     * @param {number} pow A whole number to exponentiate the expressions to.
     * @returns {Equation} the resulting equation.
     */
    pow(pow = 1) {
        this.left.pow(pow).trim();
        this.right.pow(pow).trim();
        return this;
    }

    /**
     * Solves the equation.
     * 
     * Only works on linear and quadratic equations.
     * @returns {[number | null, number | null, number]} solutions in the form [solution 1, solution 2, # of solutions].
     */
    get solutions() {
        if (!this.solveable) return [null, null, Infinity];
        const copy = this.copy;
        copy.sub(copy.right);

        if (copy.left.parts.length == 3) {
            const b = copy.left.parts[1] / copy.left.parts[2];
            const c = copy.left.parts[0] / copy.left.parts[2];
            const mid = b / 2;
            const res = [
                -mid + Math.sqrt(mid * mid - c),
                -mid - Math.sqrt(mid * mid - c)
            ];
            return [
                isNaN(res[0]) ? null : res[0],
                isNaN(res[1]) || res[1] == res[0] ? null : res[1],
                Number(!isNaN(res[0])) + Number(!isNaN(res[1]) && res[1] != res[0])
            ];
        }

        copy.sub(Expression.single(copy.left.parts[0], 0));
        if (copy.left.parts.length == 1 && copy.right.parts.length == 1 && copy.right.parts[0] != copy.left.parts[0]) return [null, null, 0];
        copy.div(Expression.single(copy.left.parts[1], 0));
        return [copy.right.parts[0], null, 1];
    }
}