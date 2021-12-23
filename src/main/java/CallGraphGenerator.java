import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.visitor.ModifierVisitor;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CallGraphGenerator {
    // This file path is for testing purposes
    //private static final String FILE_PATH = "inputcode/BankingApp";

    public static void main(String[] args) throws Exception {

        if (args.length == 0 || args[0].trim().isEmpty()) {
            System.out.println("Please specify a path to your project");
            return;
        }
        String inputProjectName = args[0].substring(args[0].lastIndexOf("/")+1);
        String modifiedDir = "./src/main/java/" + inputProjectName;
        File folder = new File(args[0]);
        new File (modifiedDir).mkdirs();

        File[] listOfFiles = folder.listFiles();
        assert listOfFiles != null;

        List<String> mainClassNameArr = new ArrayList<>();

        // to ensure the same CompilationUnit references are used in the loops
        List<CompilationUnit> cus=  new ArrayList<>();

        // Inject import statements and create logger in main()
        for(int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                cus.add(StaticJavaParser.parse(listOfFiles[i]));
                ModifierVisitor<List<String>> infraModifier = new InfrastructureModifier();
                // Note that this adds the name of the main class to mainClassNameArr once it finds it
                infraModifier.visit(cus.get(i), mainClassNameArr);
            }
        }

        String mainClassName = "";
        for (String str : mainClassNameArr) {
            if (!str.equals("null")) {
                mainClassName = str;
            }
        }

        // Inject logging statements to all source files
        for(int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                ModifierVisitor<String> methodBodyModifier = new MethodBodyModifier();
                methodBodyModifier.visit(cus.get(i), mainClassName);

                File modified_file = new File (modifiedDir, listOfFiles[i].getName());
                Files.write(modified_file.toPath(), Collections.singleton(cus.get(i).toString()),
                        StandardCharsets.UTF_8);
            }
        }
    }
}
