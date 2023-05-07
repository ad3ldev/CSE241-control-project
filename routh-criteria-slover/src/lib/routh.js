// const routhCriteria = (coefficients: number[]): boolean => {
// 	return true;
// };
import Algebrite from "algebrite";
import mathJs from "math.js";
let case1 = false;
let case2 = false;

const epsilon = Math.pow(10, -20);
function readEquation(input) {
	let equation = "";
	for (let i = 0; i < input.length; i++) {
		if (input[i] === "-") {
			equation += "+";
		}
		equation += input[i];
	}
	let equationArray = equation.split("+");
	let d = new Map();
	let degree = 0;
	for (let term in equationArray) {
		if (term === "") {
			continue;
		}
		let s_term = equationArray[term].split("s");
		if (s_term.length === 1) {
			d.set(0, Number(s_term[0]));
		} else if (s_term.length === 2) {
			if (s_term[0] === "") {
				s_term[0] = "1";
			} else if (s_term[0] === "-") {
				s_term[0] = "-1";
			}
			if (s_term[1] === "") {
				s_term[1] = "1";
			} else {
				s_term[1] = s_term[1].slice(1);
			}
			d.set(Number(s_term[1]), Number(s_term[0]));
		}
	}
	for (let key of d.keys()) {
		degree = Math.max(degree, key);
	}
	let degrees = Array.from(d.keys());
	for (let i = 0; i <= degree; i++) {
		if (!degrees.includes(i)) {
			d.set(i, 0);
		}
	}
	d = new Map([...d.entries()].sort((a, b) => b[0] - a[0]));
	return d;
}

function checkCase1(row) {
	if (row[0] === 0) {
		case1 = true;
		return true;
	}
	return false;
}

function checkCase2(row) {
	for (let i = 0; i < row.length; i++) {
		if (row[i] !== 0) {
			return false;
		}
	}
	case2 = true;
	return true;
}

function derivative(row, index, degree) {
	let newRow = new Array(row.length);
	for (let i = 0; i < row.length; i++) {
		newRow[i] = 0;
	}
	let rowDegree = degree - index;
	for (let i = 0; i < row.length; i++) {
		newRow[i] = row[i] * rowDegree;
		rowDegree -= 2;
	}
	return newRow;
}

function routhMatrix(map) {
	let degree = map.keys().next().value;
	let row = map.size;
	let column = Math.ceil(map.size / 2);
	let matrix = new Array(row);
	for (let i = 0; i < row; i++) {
		matrix[i] = new Array(column);
	}
	for (let i = 0; i < row; i++) {
		for (let j = 0; j < column; j++) {
			matrix[i][j] = 0;
		}
	}
	let i = 0;
	let j = 0;
	for (const [key, value] of map) {
		if (i % 2 == 0) {
			matrix[0][j] = value;
		} else {
			matrix[1][j] = value;
			j++;
		}
		i++;
	}
	i = 1;
	if (checkCase2(matrix[i])) {
		matrix[i] = derivative(matrix[i - 1], i - 1, degree);
	} else if (checkCase1(matrix[i])) {
		matrix[i][0] = epsilon;
	}
	for (let i = 2; i < row; i++) {
		for (let j = 0; j < column - 1; j++) {
			let a = matrix[i - 1][0];
			let b = matrix[i - 2][j + 1];
			let c = matrix[i - 1][j + 1];
			let d = matrix[i - 2][0];
			if (a === 0) {
				a = epsilon;
			}
			let result = (a * b - c * d) / a;
			matrix[i][j] = result;
		}
		if (checkCase2(matrix[i])) {
			matrix[i] = derivative(matrix[i - 1], i - 1, degree);
		} else if (checkCase1(matrix[i])) {
			matrix[i][0] = epsilon;
		}
	}
	return matrix;
}

function checkNegative(matrix) {
	for (let i = 0; i < matrix.length; i++) {
		if (matrix[i][0] > 0) {
			return false;
		}
	}
	return true;
}

function checkPositive(matrix) {
	for (let i = 0; i < matrix.length; i++) {
		if (matrix[i][0] < 0) {
			return false;
		}
	}
	return true;
}

function checkStablitiy(matrix) {
	let indicator = matrix[0][0];
	if (indicator > 0) {
		return checkPositive(matrix);
	} else {
		return checkNegative(matrix);
	}
}

function getPoles(equation) {
	let accuracy = 100000;
	// @ts-ignore
	let rootsString = Algebrite.nroots(equation).toString();
	let roots = rootsString.split(",");
	roots[0] = roots[0].slice(1);
	roots[roots.length - 1] = roots[roots.length - 1].slice(
		0,
		roots[roots.length - 1].length - 1,
	);
	for (let i = 0; i < roots.length; i++) {
		let temp = roots[i].split("...");
		if (temp.length === 2) {
			roots[i] = [mathJs.round(Number(temp[0]) * accuracy) / accuracy, 0];
		} else if (temp.length === 3) {
			roots[i] = [
				mathJs.round(Number(temp[0]) * accuracy) / accuracy,
				mathJs.round(Number(temp[1]) * accuracy) / accuracy,
			];
		}
	}
	return roots;
}

export function routhCriteria(input) {
	case1 = false;
	case2 = false;
	let equation = input;
	let map = readEquation(equation);
	let matrix = routhMatrix(map);
	let stable = checkStablitiy(matrix);
	let poles = getPoles(equation);

	return { equation, map, matrix, stable, poles, case1, case2 };
}
