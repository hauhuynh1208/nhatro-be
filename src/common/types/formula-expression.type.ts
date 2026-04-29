/**
 * JSONB expression node types for a formula's expression tree.
 *
 * number:    { type: "number", value: number }
 * variable:  { type: "variable", variable_id: string }
 * formula:   { type: "formula", formula_id: string }
 * operation: { type: "operation", operator: "+" | "-" | "*" | "/", left: ExpressionNode, right: ExpressionNode }
 * if_else:   { type: "if_else", condition: { left: ExpressionNode, operator: "==" | "!=" | ">" | "<" | ">=" | "<=", right: ExpressionNode }, then: ExpressionNode, else: ExpressionNode }
 */
export type ExpressionOperator = '+' | '-' | '*' | '/';
export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=';

export interface NumberNode {
  type: 'number';
  value: number;
}

export interface VariableNode {
  type: 'variable';
  variable_id: string;
}

export interface FormulaRefNode {
  type: 'formula';
  formula_id: string;
}

export interface OperationNode {
  type: 'operation';
  operator: ExpressionOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface IfElseNode {
  type: 'if_else';
  condition: {
    left: ExpressionNode;
    operator: ComparisonOperator;
    right: ExpressionNode;
  };
  then: ExpressionNode;
  else: ExpressionNode;
}

export type ExpressionNode =
  | NumberNode
  | VariableNode
  | FormulaRefNode
  | OperationNode
  | IfElseNode;
