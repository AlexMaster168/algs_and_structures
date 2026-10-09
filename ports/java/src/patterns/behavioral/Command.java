package patterns.behavioral;
import java.util.*;

public final class Command {
    public static class TextDocument { public String content=""; }
    public interface Operation { void execute(); void undo(); }
    public static class InsertCommand implements Operation {
        private final TextDocument document; private final int position; private final String text;
        public InsertCommand(TextDocument d,int p,String t){document=d;position=p;text=t;}
        public void execute(){var c=document.content;document.content=c.substring(0,position)+text+c.substring(position);}
        public void undo(){var c=document.content;document.content=c.substring(0,position)+c.substring(position+text.length());}
    }
    public static class DeleteCommand implements Operation {
        private final TextDocument document; private final int position,length; private String removed="";
        public DeleteCommand(TextDocument d,int p,int n){document=d;position=p;length=n;}
        public void execute(){var c=document.content;int end=Math.min(c.length(),position+length);removed=c.substring(position,end);document.content=c.substring(0,position)+c.substring(end);}
        public void undo(){var c=document.content;document.content=c.substring(0,position)+removed+c.substring(position);}
    }
    public static class MacroCommand implements Operation {
        private final List<Operation> commands;
        public MacroCommand(List<Operation> commands){this.commands=List.copyOf(commands);}
        public void execute(){commands.forEach(Operation::execute);}
        public void undo(){for(int i=commands.size()-1;i>=0;i--)commands.get(i).undo();}
    }
    public static class CommandHistory {
        private final Deque<Operation> done=new ArrayDeque<>(),undone=new ArrayDeque<>();
        public void run(Operation c){c.execute();done.push(c);undone.clear();}
        public boolean undo(){if(done.isEmpty())return false;var c=done.pop();c.undo();undone.push(c);return true;}
        public boolean redo(){if(undone.isEmpty())return false;var c=undone.pop();c.execute();done.push(c);return true;}
    }
}
