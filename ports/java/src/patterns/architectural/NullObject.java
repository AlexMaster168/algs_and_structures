package patterns.architectural;
import java.util.*;

public final class NullObject {
    public interface Logger{void info(String message);void error(String message);}
    public static class MemoryLogger implements Logger{public final List<String> lines=new ArrayList<>();public void info(String m){lines.add("INFO "+m);}public void error(String m){lines.add("ERROR "+m);}}
    public static class NullLogger implements Logger{public void info(String m){}public void error(String m){}}
    public static class PaymentService{private final Logger logger;public PaymentService(){this(new NullLogger());}public PaymentService(Logger logger){this.logger=logger;}public boolean charge(double amount){String text=amount==Math.rint(amount)?Long.toString((long)amount):Double.toString(amount);if(amount<=0){logger.error("invalid amount "+text);return false;}logger.info("charged "+text);return true;}}
}
