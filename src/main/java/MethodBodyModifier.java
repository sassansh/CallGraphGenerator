import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.body.Parameter;
import com.github.javaparser.ast.stmt.*;
import com.github.javaparser.ast.visitor.ModifierVisitor;

import java.util.*;


public class MethodBodyModifier extends ModifierVisitor<String> {

    public static final String startTime = "long startTime = System.nanoTime();";
    public static final String endTime = "long endTime = System.nanoTime();";
    public static final String calculateTime = "long duration = (endTime - startTime)/1000000;";

    @Override
    public MethodDeclaration visit(MethodDeclaration md, String mainClassName) {
        super.visit(md, mainClassName);

        String methodName = md.getNameAsString();
        if (methodName.equals("format")) {
            return md;
        }
        ClassOrInterfaceDeclaration classDec = (ClassOrInterfaceDeclaration) md.getParentNode().get();
        String className = classDec.getNameAsString();
        NodeList<Parameter> methodParams = md.getParameters();
        StringBuffer paramTypes = new StringBuffer();

        String methodInfoStart = mainClassName + ".logger.info(\" s: " + methodName + " [" + className +  ",(";

        for (int i = 0; i < methodParams.size(); i++) {
            paramTypes.append(methodParams.get(i).getType());
            paramTypes.append("-\" + " + methodParams.get(i).getNameAsString() + "+ \"");
            if (i < (methodParams.size() - 1)) {
                paramTypes.append(",");
            }
        }

        methodInfoStart += paramTypes + ")]\");";

        BlockStmt body = md.getBody().get();

        String methodInfoEnd = mainClassName + ".logger.info(\" e: " + methodName + " \" + \"[\" + duration + \"]\");";


        // add s-> to top of the method, but make sure for main() it appears after logger is instantiated

        if (md.getNameAsString().equals("main")) {
            body.addStatement(2, StaticJavaParser.parseStatement(methodInfoStart));
            body.addStatement(3, StaticJavaParser.parseStatement(startTime));
        } else {
            body.addStatement(0, StaticJavaParser.parseStatement(methodInfoStart));
            body.addStatement(1, StaticJavaParser.parseStatement(startTime));
        }

        NodeList<Statement> statements = body.getStatements();

        // add e-> before method returns or throws an error
        if (md.getType().isVoidType()) {
            // method has no return value so add end logs at the very end
            injectAsLastLine(methodInfoEnd, statements, statements.size());
        } else {
            ArrayList<String> endingLogs = new ArrayList<>();
            endingLogs.add(endTime);
            endingLogs.add(calculateTime);
            endingLogs.add(methodInfoEnd);
            StatementModifier stmtModifier = new StatementModifier(md);
            stmtModifier.visit(md, endingLogs);
        }

        return md;
    }

    private void injectAsLastLine(String methodInfoEnd, List<Statement> bodyStatements, int endIndex){
        bodyStatements.add(endIndex, StaticJavaParser.parseStatement(endTime));
        bodyStatements.add(endIndex+1, StaticJavaParser.parseStatement(calculateTime));
        bodyStatements.add(endIndex+2, StaticJavaParser.parseStatement(methodInfoEnd));
    }
}
