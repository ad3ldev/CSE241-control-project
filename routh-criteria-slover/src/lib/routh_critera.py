import math
import numpy as np

epsilon = math.pow(10, -20)


def read_equation(input):
    equation = ""
    for i in range(len(input)):
        if (input[i] == '-'):
            equation += "+"
        equation += input[i]
    equation = equation.split('+')
    d = {}
    degree = 0
    for term in equation:
        if term == '':
            continue
        s_term = term.split('s')
        if (len(s_term) == 1):
            d[0] = float(s_term[0])
        elif (len(s_term) == 2):
            if (s_term[0] == ''):
                s_term[0] = 1
            elif (s_term[0] == '-'):
                s_term[0] = -1
            if (s_term[1] == ''):
                s_term[1] = 1
            else:
                s_term[1] = float(s_term[1][1:])
            d[s_term[1]] = float(s_term[0])
    degree = max(d.keys())
    for i in range(int(degree)):
        if i not in d:
            d[i] = 0
    d = dict(reversed((sorted(d.items()))))
    return d


def check_case1(row):
    if row[0] == 0:
        return True
    return False


def check_case2(row):
    for item in row:
        if item != 0:
            return False
    return True


def derivative(row, index, degree):
    new_row = [0 for x in range(len(row))]
    row_degree = degree - index
    for i in range(len(row)):
        new_row[i] = row[i]*row_degree
        row_degree -= 2
    return new_row


def routh_matrix(map):
    degree = list(map.keys())[0]
    row = len(map)
    column = math.ceil(len(map)/2)
    matrix = [[0 for x in range(column)] for y in range(row)]
    i = 0
    j = 0
    for key in map:
        if (i % 2 == 0):
            matrix[0][j] = map[key]
        else:
            matrix[1][j] = map[key]
            j += 1
        i += 1

    for i in range(2, len(matrix)):
        for j in range(len(matrix[i]) - 1):
            a = matrix[i-1][0]
            b = matrix[i-2][j+1]
            c = matrix[i-1][j+1]
            d = matrix[i-2][0]
            if a == 0:
                a = epsilon
            result = (a*b - c*d)/a
            matrix[i][j] = result
        if check_case2(matrix[i]):
            matrix[i] = derivative(matrix[i-1], i-1, degree)
        elif check_case1(matrix[i]):
            matrix[i][0] = epsilon
    return matrix


def check_negative(matrix):
    for i in range(len(matrix)):
        if (matrix[i][0] > 0):
            return False
    return True


def check_positive(matrix):
    for i in range(len(matrix)):
        if (matrix[i][0] < 0):
            return False
    return True


def check_stability(matrix):
    indicator = matrix[0][0]
    if (indicator > 0):
        return check_positive(matrix)
    else:
        return check_negative(matrix)


def get_poles(map):
    coeff = [0 for x in range(len(map))]
    i = 0
    for key in map:
        coeff[i] = map[key]
        i += 1
    roots = np.roots(coeff)
    return roots


if __name__ == "__main__":
    print("Routh Stability criteria")
    print("#############################")
    print("Input the characteristic equation in this form: s^4+s^3+2s^2+10s+100")
    equation = input()
    print()
    map = read_equation(equation)
    matrix = routh_matrix(map)
    stable = check_stability(matrix)
    print("Routh Matrix: ")
    print("------------------------")
    for row in matrix:
        print(row)
    print("------------------------")
    if (not stable):
        print("System is Unstable")
    else:
        print("System is Stable")
    roots = get_poles(map)
    print("Poles of system: ")
    print(roots)
