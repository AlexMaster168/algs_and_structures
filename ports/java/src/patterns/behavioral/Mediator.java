package patterns.behavioral;
import java.util.*;

public final class Mediator {
    public interface ChatMediator {void join(ChatUser user);void send(ChatUser from,String message,String to);}
    public static class ChatUser {
        public final String name;public final List<String> inbox=new ArrayList<>();private ChatMediator room;
        public ChatUser(String name){this.name=name;}
        public void attach(ChatMediator room){this.room=room;}
        public void say(String message){say(message,null);}
        public void say(String message,String to){if(room==null)throw new IllegalStateException("Not in a room");room.send(this,message,to);}
        public void receive(String from,String message){inbox.add(from+": "+message);}
    }
    public static class ChatRoom implements ChatMediator {
        private final Map<String,ChatUser> users=new LinkedHashMap<>();
        public void join(ChatUser user){users.put(user.name,user);user.attach(this);}
        public void send(ChatUser from,String message,String to){if(to!=null){var user=users.get(to);if(user!=null)user.receive(from.name,message);}else for(var user:users.values())if(user!=from)user.receive(from.name,message);}
    }
}
