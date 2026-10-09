package patterns.behavioral;
import java.util.*;
import java.util.regex.*;

public final class Interpreter {
    public interface Expression { double interpret(Map<String,Double> context); }
    public record NumberExpression(double value) implements Expression {
        public double interpret(Map<String,Double> c){return value;}
        public String toString(){return value==Math.rint(value)?Long.toString((long)value):Double.toString(value);}
    }
    public record VariableExpression(String name) implements Expression {
        public double interpret(Map<String,Double> c){if(!c.containsKey(name))throw new IllegalArgumentException("Undefined variable: "+name);return c.get(name);}
        public String toString(){return name;}
    }
    public record BinaryExpression(String operator,Expression left,Expression right) implements Expression {
        public double interpret(Map<String,Double> c){double a=left.interpret(c),b=right.interpret(c);return switch(operator){case "+"->a+b;case "-"->a-b;case "*"->a*b;case "/"->a/b;default->throw new IllegalArgumentException(operator);};}
        public String toString(){return "("+left+" "+operator+" "+right+")";}
    }
    private static class Parser {
        final List<String> tokens=new ArrayList<>();int position;
        Parser(String s){Matcher m=Pattern.compile("\\d+(?:\\.\\d+)?|[A-Za-z_]\\w*|[-+*/()]").matcher(s);while(m.find())tokens.add(m.group());}
        String peek(){return position<tokens.size()?tokens.get(position):"";}
        String consume(){if(position>=tokens.size())throw new IllegalArgumentException("Unexpected end");return tokens.get(position++);}
        Expression primary(){String t=consume();if(t.equals("(")){Expression x=sum();if(!consume().equals(")"))throw new IllegalArgumentException("Expected )");return x;}if(Character.isDigit(t.charAt(0)))return new NumberExpression(Double.parseDouble(t));if(Character.isLetter(t.charAt(0))||t.charAt(0)=='_')return new VariableExpression(t);throw new IllegalArgumentException(t);}
        Expression product(){Expression x=primary();while(peek().equals("*")||peek().equals("/"))x=new BinaryExpression(consume(),x,primary());return x;}
        Expression sum(){Expression x=product();while(peek().equals("+")||peek().equals("-"))x=new BinaryExpression(consume(),x,product());return x;}
    }
    public static Expression parseExpression(String source){var p=new Parser(source);var result=p.sum();if(p.position!=p.tokens.size())throw new IllegalArgumentException("Unexpected token");return result;}
}
