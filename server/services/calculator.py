import ast
from decimal import Decimal, InvalidOperation, DivisionByZero, Overflow
import re


class CalculatorError(Exception):
    def __init__(self, message: str, error_code: str = "CALCULATION_ERROR"):
        super().__init__(message)
        self.message = message
        self.error_code = error_code


class DivisionByZeroError(CalculatorError):
    def __init__(self, message: str = "Cannot divide by zero"):
        super().__init__(message=message, error_code="DIVISION_BY_ZERO")


class InvalidSyntaxError(CalculatorError):
    def __init__(
        self, message: str = "Invalid expression syntax or unsupported characters"
    ):
        super().__init__(message=message, error_code="INVALID_SYNTAX")


class CalculatorService:
    @staticmethod
    def sanitize_expression(expr: str) -> str:
        if not expr or not expr.strip():
            raise InvalidSyntaxError("Expression cannot be empty")

        # Normalize unicode operator symbols
        sanitized = expr.replace("×", "*").replace("÷", "/").replace("−", "-")

        # Check for disallowed characters (only allow digits, operators, parentheses, decimal points, spaces)
        if re.search(r"[^0-9+\-*/%().\s]", sanitized):
            raise InvalidSyntaxError(
                "Invalid expression syntax or unsupported characters"
            )

        return sanitized.strip()

    @classmethod
    def _eval_node(cls, node: ast.AST) -> Decimal:
        if isinstance(node, ast.Expression):
            return cls._eval_node(node.body)

        elif isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                try:
                    return Decimal(str(node.value))
                except InvalidOperation:
                    raise InvalidSyntaxError("Invalid numeric value")
            raise InvalidSyntaxError("Unsupported constant in expression")

        elif isinstance(node, ast.UnaryOp):
            operand = cls._eval_node(node.operand)
            if isinstance(node.op, ast.UAdd):
                return +operand
            elif isinstance(node.op, ast.USub):
                return -operand
            else:
                raise InvalidSyntaxError("Unsupported unary operator")

        elif isinstance(node, ast.BinOp):
            left = cls._eval_node(node.left)
            right = cls._eval_node(node.right)

            try:
                if isinstance(node.op, ast.Add):
                    return left + right
                elif isinstance(node.op, ast.Sub):
                    return left - right
                elif isinstance(node.op, ast.Mult):
                    return left * right
                elif isinstance(node.op, ast.Div):
                    if right == 0:
                        raise DivisionByZeroError("Cannot divide by zero")
                    return left / right
                elif isinstance(node.op, ast.Mod):
                    if right == 0:
                        raise DivisionByZeroError("Cannot divide by zero")
                    return left % right
                else:
                    raise InvalidSyntaxError("Unsupported binary operator")
            except (DivisionByZero, ZeroDivisionError):
                raise DivisionByZeroError("Cannot divide by zero")
            except Overflow:
                raise CalculatorError(
                    "Calculation result overflow", error_code="OVERFLOW_ERROR"
                )
            except InvalidOperation:
                raise InvalidSyntaxError("Invalid arithmetic operation")

        else:
            raise InvalidSyntaxError(
                "Invalid expression syntax or unsupported characters"
            )

    @classmethod
    def evaluate(cls, expression: str) -> float:
        sanitized = cls.sanitize_expression(expression)

        try:
            tree = ast.parse(sanitized, mode="eval")
        except SyntaxError:
            raise InvalidSyntaxError(
                "Invalid expression syntax or unsupported characters"
            )

        result_decimal = cls._eval_node(tree)
        return float(result_decimal)


calculator_service = CalculatorService()
