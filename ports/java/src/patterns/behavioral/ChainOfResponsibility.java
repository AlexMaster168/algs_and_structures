package patterns.behavioral;
import java.util.Map;

public final class ChainOfResponsibility {
    public record Ticket(String topic,int severity) {}
    public abstract static class SupportHandler {
        private SupportHandler next;
        public SupportHandler setNext(SupportHandler handler) { next=handler; return handler; }
        public String handle(Ticket ticket) { return canHandle(ticket)?resolve(ticket):next!=null?next.handle(ticket):"Unresolved: "+ticket.topic(); }
        protected abstract boolean canHandle(Ticket ticket);
        protected abstract String resolve(Ticket ticket);
    }
    public static class FaqBot extends SupportHandler {
        private static final Map<String,String> answers=Map.of("password","Use the \"Forgot password\" link","delivery","Delivery takes 3-5 days");
        protected boolean canHandle(Ticket t){return t.severity()==1 && answers.containsKey(t.topic());}
        protected String resolve(Ticket t){return "Bot: "+answers.get(t.topic());}
    }
    public static class SupportAgent extends SupportHandler {
        protected boolean canHandle(Ticket t){return t.severity()<=2;}
        protected String resolve(Ticket t){return "Agent resolved "+t.topic();}
    }
    public static class Engineer extends SupportHandler {
        protected boolean canHandle(Ticket t){return true;}
        protected String resolve(Ticket t){return "Engineer fixed "+t.topic();}
    }
    public static SupportHandler createSupportChain(){var bot=new FaqBot();bot.setNext(new SupportAgent()).setNext(new Engineer());return bot;}
}
