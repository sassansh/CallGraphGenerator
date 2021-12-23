import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.*;
import com.github.javaparser.ast.expr.MarkerAnnotationExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import com.github.javaparser.ast.type.ClassOrInterfaceType;
import com.github.javaparser.ast.visitor.ModifierVisitor;
import com.github.javaparser.ast.Modifier;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Formatter;

public class InfrastructureModifier extends ModifierVisitor<List<String>> {

    @Override
    public CompilationUnit visit(CompilationUnit cu, List<String> className) {
        super.visit(cu, className);
        cu.addImport("java.util.logging.Logger");

        String projectName = cu.getPackageDeclaration().get().getName().toString();

        // Find the name of the class that contains main()
        String mainClassName = findMainClass(cu);
        className.add(mainClassName);

        cu.getClassByName(mainClassName).ifPresent(mainClass -> {
            addStaticLoggerVariable(mainClass);
            addCustomLogFormatting(mainClass);
            addLogOutputHandling(cu, mainClass, projectName);
        });
        return cu;
    }

    // Find the name of the class that contains main()
    private String findMainClass(CompilationUnit cu) {
        AtomicReference<String> mainClassName = new AtomicReference<>();
        cu.getChildNodes().forEach(c -> {
            if (c.getClass().equals(ClassOrInterfaceDeclaration.class)) {
                for (BodyDeclaration member: ((ClassOrInterfaceDeclaration) c).getMembers()) {
                    if (member.isMethodDeclaration()) {
                        MethodDeclaration methodDec = (MethodDeclaration) member;
                        if (methodDec.getNameAsString().equals("main")) {
                            mainClassName.set(((ClassOrInterfaceDeclaration) c).getNameAsString());
                        }
                    }
                }
            }
        });
        return String.valueOf(mainClassName);
    }

    private void addLogOutputHandling(CompilationUnit cu, ClassOrInterfaceDeclaration mainClass, String projectName) {
        for (BodyDeclaration member : mainClass.getMembers()) {
            if (member.isMethodDeclaration()) {
                MethodDeclaration field = (MethodDeclaration) member;
                if(field.getNameAsString().equals("main")) {
                    cu.addImport("java.util.logging.*");
                    cu.addImport("java.io.IOException");
                    BlockStmt body = field.getBody().get();
                    body.addStatement(0, StaticJavaParser.parseStatement("FileHandler fh;"));
                    String logFilePath = "./src/main/java/output.log";
                    String tryCatchBlock = "try { " +
                            "fh = new FileHandler(\"" + logFilePath + "\"); " +
                            "logger.addHandler(fh);" +
                            "CustomFormatter formatter = new CustomFormatter();" +
                            "fh.setFormatter(formatter);" +
                            "logger.info(\" Program: " + projectName + "\");" +
                            "} catch (SecurityException e) {" +
                            "e.printStackTrace();}" +
                            "catch (IOException e) {" +
                            "e.printStackTrace();}";
                    body.addStatement(1, StaticJavaParser.parseStatement(tryCatchBlock));
                }
            }
        }
    }

    private ClassOrInterfaceDeclaration addCustomLogFormatting(ClassOrInterfaceDeclaration mainClass) {
        ClassOrInterfaceDeclaration classToModify = mainClass;
        for (BodyDeclaration member : mainClass.getMembers()) {
            if (member.isMethodDeclaration()) {
                MethodDeclaration field = (MethodDeclaration) member;
                if (field.getNameAsString().equals("main")) {
                    // if this class is the Main class, then add the custom formatter as an inner class
                    ClassOrInterfaceDeclaration formatterClass = new ClassOrInterfaceDeclaration();
                    formatterClass.setName("CustomFormatter");
                    formatterClass.setPrivate(true);
                    formatterClass.setStatic(true);
                    formatterClass.addExtendedType(Formatter.class);
                    // create method that overrides the Formatter's format() method
                    MethodDeclaration formatMethod = formatterClass.addMethod("format", Modifier.publicModifier().getKeyword());
                    ClassOrInterfaceType logRecordType = StaticJavaParser.parseClassOrInterfaceType("LogRecord");
                    Parameter param = new Parameter(logRecordType, "record");
                    formatMethod.addParameter(param);
                    // create String return type
                    ClassOrInterfaceType returnType = StaticJavaParser.parseClassOrInterfaceType("String");
                    formatMethod.setType(returnType);
                    // add @Override annotation
                    MarkerAnnotationExpr overrideAnnotation = new MarkerAnnotationExpr("Override");
                    formatMethod.addAnnotation(overrideAnnotation);
                    // add lines of code to the method
                    String methodLines = "StringBuilder sb = new StringBuilder();";
                    String appendLevel = "sb.append(record.getLevel()).append(':');";
                    String appendMsg = "sb.append(record.getMessage()).append('\\n');";
                    String returnStmt = "return sb.toString();";
                    BlockStmt body = formatMethod.getBody().get();
                    body.addStatement(0, StaticJavaParser.parseStatement(methodLines));
                    body.addStatement(1, StaticJavaParser.parseStatement(appendLevel));
                    body.addStatement(2, StaticJavaParser.parseStatement(appendMsg));
                    body.addStatement(3, StaticJavaParser.parseStatement(returnStmt));

                    classToModify.addMember(formatterClass);
                    return classToModify;
                }
            }
        }
        return classToModify;
    }

    private void addStaticLoggerVariable(ClassOrInterfaceDeclaration mainClass) {
        NodeList<Modifier> modifiers = NodeList.nodeList(Modifier.publicModifier(), Modifier.staticModifier(),
                Modifier.finalModifier());
        VariableDeclarator vd = new VariableDeclarator()
                .setType("Logger").setName("logger")
                .setInitializer("Logger.getLogger(\"ToolLog\");");
        FieldDeclaration fd = new FieldDeclaration().addVariable(vd);
        fd.setModifiers(modifiers);
        mainClass.getMembers().add(0, fd);
    }
}
