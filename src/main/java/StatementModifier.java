import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.Expression;
import com.github.javaparser.ast.stmt.BlockStmt;
import com.github.javaparser.ast.stmt.ReturnStmt;
import com.github.javaparser.ast.stmt.Statement;
import com.github.javaparser.ast.stmt.ThrowStmt;
import com.github.javaparser.ast.visitor.ModifierVisitor;

import java.util.ArrayList;
import java.util.Optional;

public class StatementModifier extends ModifierVisitor<ArrayList<String>> {
    public MethodDeclaration md;

    public StatementModifier(MethodDeclaration md) {
        this.md = md;
    }

    // For adding ending logs before return statements
    @Override
    public ReturnStmt visit(ReturnStmt stmt, ArrayList<String> methodInfoEnd) {
        super.visit(stmt, methodInfoEnd);
        Optional<Expression> returnExpression = stmt.getExpression();
        if (returnExpression.isPresent()) {
            Expression expr = returnExpression.get();
            if (expr.isMethodCallExpr()) {
                rewriteReturn(stmt, expr);
                stmt.setExpression(StaticJavaParser.parseExpression("returnVal"));
            }
        }
        insertEndLogs(stmt, methodInfoEnd);
        return stmt;
    }

    // For adding ending logs before throw statements
    @Override
    public ThrowStmt visit(ThrowStmt stmt, ArrayList<String> methodInfoEnd) {
        super.visit(stmt, methodInfoEnd);
        insertEndLogs(stmt, methodInfoEnd);
        return stmt;
    }


    private void insertEndLogs(Statement stmt, ArrayList<String> methodInfoEnd) {
        BlockStmt parent = (BlockStmt) stmt.getParentNode().get();
        NodeList<Statement> statements = parent.getStatements();
        for (int i = 0; i< methodInfoEnd.size(); i++) {
            statements.addBefore(StaticJavaParser.parseStatement(methodInfoEnd.get(i)), stmt);
        }
    }

    private void rewriteReturn(Statement stmt, Expression expr) {
        BlockStmt parent = (BlockStmt) stmt.getParentNode().get();
        NodeList<Statement> statements = parent.getStatements();
        Statement returnVar = StaticJavaParser.parseStatement(md.getTypeAsString() + " returnVal = " + expr.toString() + ";");
        statements.addBefore(returnVar, stmt);
    }

}
