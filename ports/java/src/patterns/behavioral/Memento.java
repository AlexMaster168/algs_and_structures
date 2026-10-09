package patterns.behavioral;
import java.util.*;

public final class Memento {
    public record EditorSnapshot(String content,int cursor) {}
    public static class Editor {
        private String content="";private int cursor;
        public String text(){return content;}public int cursorPosition(){return cursor;}
        public void type(String text){content=content.substring(0,cursor)+text+content.substring(cursor);cursor+=text.length();}
        public void moveCursor(int position){cursor=Math.max(0,Math.min(content.length(),position));}
        public EditorSnapshot save(){return new EditorSnapshot(content,cursor);}
        public void restore(EditorSnapshot snapshot){content=snapshot.content();cursor=snapshot.cursor();}
    }
    public static class EditorHistory {
        private final Editor editor;private final Deque<EditorSnapshot> snapshots=new ArrayDeque<>();
        public EditorHistory(Editor editor){this.editor=editor;}public void backup(){snapshots.push(editor.save());}
        public boolean undo(){if(snapshots.isEmpty())return false;editor.restore(snapshots.pop());return true;}
    }
}
